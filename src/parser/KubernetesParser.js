import { DefaultParser } from '@ditrit/leto-modelizer-plugin-core';
import { parse as lidyParse } from '../lidy/k8s';
import KubernetesListener from './KubernetesListener';

/**
 * Class to parse and retrieve components from Kubernetes files.
 */
class KubernetesParser extends DefaultParser {
  /**
   * Indicate if this parser can parse this file by checking its extension and, if it exists, its
   * content for specific keywords.
   * @param {FileInformation|FileInput} [file] - File information or file input.
   * @returns {boolean} Boolean that indicates if this file can be parsed or not.
   */
  isParsable(file) {
    if (file.path.indexOf('/.github/') >= 0) {
      return false;
    }

    const isYamlExtension = /\.ya?ml$/.test(file.path);
    const keywords = ['apiVersion', 'kind'];

    if (!file.content || file.content.trim().length === 0) {
      return isYamlExtension;
    }

    return isYamlExtension && keywords.every((keyword) => file.content.includes(keyword));
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
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput[]} [inputs] - Data you want to parse.
   * @param {string} [parentEventId] - Parent event id.
   */
  parse(diagram, inputs = [], parentEventId = null) {
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];

    inputs
      .filter(({ path }) => path.split('/').slice(0, -1).join('/') === diagram.path)
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
        const eventId = this.pluginData.emitEvent({
          parent: parentEventId,
          type: 'Parser',
          action: 'read',
          status: 'running',
          files: [input.path],
          data: {
            global: false,
          },
        });

        const listener = new KubernetesListener(this.pluginData, input);

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
            errors,
            warnings,
            imports,
            alreadyImported,
            root,
          },
        });

        this.pluginData.emitEvent({ id: eventId, status: 'success' });
      });

    this.__convertSelectorAttributesToLinks();
  }

  /**
   * Convert all selector attributes from K8S Object to Leto Link format.
   */
  __convertSelectorAttributesToLinks() {
    this.pluginData.components.forEach((component) => {
      const selectorAttribute = component.getAttributeByName('selector');
      if (selectorAttribute?.definition?.type === 'Link') {
        // TODO: support "matchExpressions" selectors
        selectorAttribute.value = this.pluginData
          .getComponentsByType(selectorAttribute.definition.linkRef)
          .filter(({ attributes }) => {
            const targetLabelsAttribute = attributes
              .find(({ name }) => name === 'metadata')?.value
              ?.find(({ name }) => name === 'labels');
            if (!targetLabelsAttribute) {
              return false;
            }
            const selectorLabels = this.__convertObjectAttributeToJsObject(selectorAttribute);
            const targetLabels = this.__convertObjectAttributeToJsObject(targetLabelsAttribute);
            const selectorLabelsKeys = Object.keys(selectorLabels);
            return selectorLabelsKeys.length
              && selectorLabelsKeys.every((key) => selectorLabels[key] === targetLabels[key]);
          }).map(({ id }) => id);
      }
    });
  }

  /**
   * Convert an attribute of type Object to a plain key/value JS object.
   * @param {ComponentAttribute} objectAttribute - The attribute of type Object to convert.
   * @returns {object} - The converted plain key/value JS object.
   */
  __convertObjectAttributeToJsObject(objectAttribute) {
    return objectAttribute.value.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});
  }
}

export default KubernetesParser;
