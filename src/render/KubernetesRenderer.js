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

  formatComponent(component, hasKindAndApiVersion=true, nameFormat='metadata') {
    let formatted = this.formatAttributes(component.attributes);
    formatted = this.insertComponentName(formatted, component, nameFormat);

    if (hasKindAndApiVersion) {
      formatted = this.insertFront(
        formatted, 'kind', component.definition.type
      );
      formatted = this.insertFront(
        formatted, 'apiVersion', component.definition.apiVersion
      );
    }
    this.insertSubComponentAttributes(formatted, component);

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

  insertComponentName(formatted, component, nameFormat='metadata') {
    if (nameFormat === 'metadata') {
      formatted = this.insertFront(
        formatted, 'metadata', this.insertFront(
          formatted.metadata || {}, 'name', component.name,
        ),
      );
    } else if (nameFormat === 'simple') {
      formatted.name = component.name;
    } else {
      throw new Error(`Unexpected value for nameFormat: '${nameFormat}'`);
    }
    return formatted;
  }

  insertFront(object, key, value) {
    delete object[key];
    return {
      [key]: value,
      ...object,
    }
  }

  insertSubComponentAttributes(formatted, component) {
    if (component.children.length == 0) {
      return;
    }
    if (component.definition.type == 'Deployment') {
      const podComponent = component.children[0];
      // FIXME: what if there are multiple Pod children?
      // For now, we can ignore them, but later we will need a way
      // to limit the number of children at metadata level
      const deploymentSpec = formatted.spec || {};
      deploymentSpec.template = this.formatComponent(podComponent, false);
      formatted.spec = deploymentSpec;
    } else if (component.definition.type == 'Pod') {
      const k8sContainerComponents = component.children.filter(
        (component) => component.definition.type == 'Container'
      );
      const k8sInitContainerComponents = component.children.filter(
        (component) => component.definition.type == 'InitContainer'
      );
      const podSpec = formatted.spec || {};
      podSpec.containers = k8sContainerComponents.map(
        (k8sContainerComponent) => this.formatComponent(k8sContainerComponent, false, 'simple')
      );
      podSpec.initContainers = k8sInitContainerComponents.map(
        (k8sContainerComponent) => this.formatComponent(k8sContainerComponent, false, 'simple')
      );
      formatted.spec = podSpec;
    } else if (component.definition.type == 'Container') {
      const volumeComponents = component.children[0];
      // FIXME: what if there are multiple Container children?
      // => same as for Pods in Deployment.
    }
  }
}

export default KubernetesRenderer;
