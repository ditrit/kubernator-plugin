import {
  DefaultRender,
  FileInput,
} from 'leto-modelizer-plugin-core';
import yaml from 'js-yaml'

/**
 * Class to render Kubernetes files from components.
 */
class KubernetesRenderer extends DefaultRender {
  constructor(pluginData) {
    super(pluginData);
    this.renderComponent = this.renderComponent.bind(this);
    this.renderAttributes = this.renderAttributes.bind(this);
  }

  /**
   * Convert all provided components and links to Kubernetes files.
   *
   * @returns {FileInput[]} Array of generated files from components and links.
   */
  render() {
    console.log('Renderer');
    console.log(this.pluginData.components);
    return this.pluginData.components.map(this.renderComponent);
  }

  renderComponent(component) {
    const renderedComponent = {
      apiVersion: component.definition.apiVersion,
      kind: component.definition.type,
      ...this.renderAttributes(component.attributes),
    };
    const metadata = renderedComponent.metadata || {};
    metadata.name = component.name;
    renderedComponent.metadata = metadata;

    console.log(renderedComponent);
    return new FileInput({
      path: `${component.name}.yaml`,
      content: yaml.dump(renderedComponent),
    });
  }

  renderAttributes(attributes) {
    return attributes.reduce((acc, attribute) => {
      console.log(`${attribute.name} ${attribute.type}`);
      acc[attribute.name] = attribute.type !== 'Object' ?
        attribute.value : this.renderAttributes(attribute.value)
      return acc;
    }, []);
  }
}

export default KubernetesRenderer;
