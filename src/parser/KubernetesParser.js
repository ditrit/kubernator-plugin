import { DefaultParser, FileInput } from 'leto-modelizer-plugin-core';
import { parse as lidyParse } from '../lidy/k8s';
import KubernetesListener from './KubernetesListener';

/**
 *  Class to parse and retrieve components from Kubernetes files.
 */
class KubernetesParser extends DefaultParser {
  /**
   * Indicate if this parser can parse this file by checking its extension and, if it exists, its
   * content for specific keywords.
   * @param {FileInformation|FileInput} [file] - File information or file input.
   * @returns {boolean} Boolean that indicates if this file can be parsed or not.
   */
  isParsable(file) {
    const isYamlExtension = /\.ya?ml$/.test(file.path);
    if (file.content === undefined) {
      return isYamlExtension;
    }
    const keywords = ['apiVersion', 'kind'];
    return isYamlExtension && keywords.every((keyword) => file.content?.includes(keyword));
  }

  /**
   * Get the list of model paths from all files. Diagrams are represented by directories.
   * @param {FileInformation[]|FileInput[]} [files] - List of files.
   * @returns {string[]} List of folder paths that represent a model.
   */
  getModels(files = []) {
    return files.filter((file) => this.isParsable(file))
      .reduce((acc, { path }) => {
        const dirPath = path.split('/').slice(0, -1).join('/');
        if (!acc.includes(dirPath)) {
          acc.push(dirPath);
        }
        return acc;
      }, []);
  }

  /**
   * Convert the content of files into Components.
   *
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput[]} [inputs] - Data you want to parse.
   * @param {string} [parentEventId] - Parent event id.
   */
  parse(diagram, inputs = [], parentEventId = null) {
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];

    inputs
      .filter(({ path }) => path.startsWith(diagram.path))
      .filter(({ content, path }) => {
        if (content && content.trim() !== '') {
          return true;
        }
        this.pluginData.emitEvent({
          parent: parentEventId,
          type: 'Parser',
          action: 'read',
          status: 'warning',
          files: [path],
          data: {
            code: 'no_content',
            global: false,
          },
        });
        return false;
      })
      .forEach((input) => {
        const id = this.pluginData.emitEvent({
          parent: parentEventId,
          type: 'Parser',
          action: 'read',
          status: 'running',
          files: [input.path],
          data: {
            global: false,
          },
        });

        const listener = new KubernetesListener(input, this.pluginData);

        const errors = [];
        const warnings = [];
        const imports = [];
        const alreadyImported = [];
        const root = [];

        lidyParse({
          src_data: input.content,
          listener,
          path: input.path,
          prog: {
            errors: errors,
            warnings: warnings,
            imports: imports,
            alreadyImported: alreadyImported,
            root: root,
          },
        });

        this.pluginData.components.push(...listener.components);
        this.pluginData.emitEvent({ id, status: 'success' });
      });

    this.convertSelectorAttributesToLinks();
    console.log('P', this.pluginData.components);
  }

  convertSelectorAttributesToLinks() {
    this.pluginData.components.forEach((component) => {
      const selectorAttribute = component.getAttributeByName('selector');
      if (selectorAttribute) {
        switch (component.definition.type) {
          case 'Service':
            this.__convertSelectorToLinkAttribute(selectorAttribute, 'Pod');
            break;
          case 'PersistentVolumeClaim':
            // This plugin does not have a PersistentVolume resource,
            // so the selector should not be converted into a link attribute.
            break;
          default:
            throw new Error(`Unknown selector in component '${component.id}'.`);
        }
      }
    });
  }

  __convertSelectorToLinkAttribute(matchLabelsAttribute, targetComponentType) {
    // TODO: support "matchExpressions" selectors
    matchLabelsAttribute.value =
      this.pluginData.getComponentsByType(targetComponentType).filter(
        ({attributes}) => {
          const targetLabelsAttribute = attributes.find(
            ({name}) => name === 'metadata'
          )?.value?.find(
            ({name}) => name === 'labels'
          );
          if (!targetLabelsAttribute) {
            return false;
          }
          const selectorLabels =
            this.convertObjectAttributeToJsObject(matchLabelsAttribute);
          const targetLabels =
            this.convertObjectAttributeToJsObject(targetLabelsAttribute);
          const selectorLabelsKeys = Object.keys(selectorLabels);
          return selectorLabelsKeys.length && selectorLabelsKeys.every(
            (key) => selectorLabels[key] === targetLabels[key]
          );
        }
      ).map(({id}) => id);
  }

  convertObjectAttributeToJsObject(objectAttribute) {
    return objectAttribute.value.reduce((acc, {name, value}) => {
      acc[name] = value;
      return acc;
    }, {});
  }
}

export default KubernetesParser;
