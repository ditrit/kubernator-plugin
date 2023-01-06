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
    return this.pluginData.components.map(this.renderComponent, this);
  }

  renderComponent(component) {
    const formattedComponent = {
      apiVersion: component.definition.apiVersion,
      kind: component.definition.type,
      ...this.formatAttributes(component.attributes),
    };
    const metadata = formattedComponent.metadata || {};
    metadata.name = component.name;
    formattedComponent.metadata = metadata;

    return new FileInput({
      path: component.path || `${component.name}.yaml`,
      content: yaml.dump(formattedComponent),
    });
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
}

export default KubernetesRenderer;
