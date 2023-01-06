import {
  DefaultRender,
  FileInput,
} from 'leto-modelizer-plugin-core';
import yaml from 'js-yaml'

/**
 * Class to render Kubernetes files from components.
 */
class KubernetesRenderer extends DefaultRender {
  /**
   * Convert all provided components and links to Kubernetes files.
   *
   * @returns {FileInput[]} Array of generated files from components and links.
   */
  render() {
    console.log('R', this.pluginData.components);
    return this.pluginData.components.map((component) =>
      new FileInput({
        path: component.path || `${component.name}.yaml`,
        content: yaml.dump(this.formatComponent(component)),
      })
    );
  }

  formatComponent(component, isSubComponent=false) {
    let formatted = this.formatAttributes(component.attributes);
    if (!isSubComponent) {
      formatted = { // insert apiVersion and kind to the beginning of the formatted object
        apiVersion: component.definition.apiVersion,
        kind: component.definition.type,
        ...formatted
      };
    }
    this.insertSubComponentAttributes(formatted, component);

    const metadata = formatted.metadata || {};
    formatted.metadata = { // insert name to the beginning of the metadata object
      name: component.name,
      ...metadata,
    };

    return formatted;
  }

  formatAttributes(attributes) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type == 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value);
      } else if (attribute.type == 'Array') {
        acc[attribute.name] = Object.values(this.formatAttributes(attribute.value));
      } else {
        acc[attribute.name] = attribute.value;
      }
      return acc;
    }, {});
  }

  insertSubComponentAttributes(formatted, component) {
    if (component.children.length > 0
        && component.definition.type == 'Deployment') {
      const spec = formatted.spec || {};
      spec.template = this.formatComponent(component.children[0], true);
      formatted.spec = spec;
    }
  }
}

export default KubernetesRenderer;
