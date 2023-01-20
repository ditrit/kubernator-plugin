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
        content: yaml.dump(this.formatComponent(component, true, 'metadata')),
      })
    );
  }

  formatComponent(component, hasKindAndApiVersion, nameFormat) {
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
    this.insertDefaultValues(formatted, component);
    this.insertChildrenComponentAttributes(formatted, component);

    return formatted;
  }

  formatAttributes(attributes) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value);
      } else if (attribute.type === 'Array') {
        acc[attribute.name] = Object.values(this.formatAttributes(attribute.value));
      } else {
        acc[attribute.name] = attribute.value;
      }
      return acc;
    }, {});
  }

  insertComponentName(formatted, component, nameFormat) {
    if (nameFormat === 'metadata') {
      // For all top level components, the name is stored in the metadata object.
      // Nested Pods and Jobs also have their name in the metadata object.
      formatted = this.insertFront(
        formatted, 'metadata', this.insertFront(
          formatted.metadata || {}, 'name', component.name,
        )
      );
    } else if (nameFormat === 'simple') {
      // For some nested components (Container, VolumeMounts, ...) the name is stored directly in its main object.
      formatted = this.insertFront(formatted, 'name', component.name);
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

  insertDefaultValues(formatted, component) {
    if (component.definition.type === 'Deployment') {
      const deploymentSpec = formatted.spec || {};
      deploymentSpec.selector ||= {};
      formatted.spec = deploymentSpec;
    }
  }

  insertChildrenComponentAttributes(formatted, component) {
    if (!component.children.length) {
      return;
    }
    switch (component.definition.type) {
      case 'Deployment':
        const podComponent = component.children[0];
        // FIXME: what if there are multiple Pod children?
        // For now, we can ignore them, but later we will need a way
        // to limit the number of children at metadata level
        const deploymentSpec = formatted.spec || {};
        deploymentSpec.template = this.formatComponent(podComponent, false, 'metadata');
        formatted.spec = deploymentSpec;
        break;
      case 'Pod':
        this.insertPodChildrenComponentAttributes(formatted, component);
        break;
      case 'Container':
      case 'InitContainer':
        const volumeComponents = component.children;
        formatted.volumeMounts = volumeComponents.map(
          (volumeComponent) => this.formatComponent(volumeComponent, false, 'simple')
        );
        break;
    }
  }

  insertPodChildrenComponentAttributes(formatted, component) {
    const podSpec = formatted.spec || {};
    const volumes = [];
    const k8sContainerTypes = [
      {kind: 'Container', attributeName: 'containers'},
      {kind: 'InitContainer', attributeName: 'initContainers'},
    ];
    k8sContainerTypes.forEach((k8sContainerType) => {
      const k8sContainerComponents = component.children.filter(
        (component) => component.definition.type === k8sContainerType.kind
      );
      if (k8sContainerComponents.length) {
        podSpec[k8sContainerType.attributeName] = k8sContainerComponents.map(
          (k8sContainerComponent) => {
            const formattedContainer = this.formatComponent(k8sContainerComponent, false, 'simple');
            const volumeComponents = k8sContainerComponent.children;
            volumes.push(...volumeComponents.map(
              (volumeComponent) => this.formatComponent(volumeComponent, false, 'simple')
            ));
            return formattedContainer;
          }
        );
      }
    });
    formatted.spec = podSpec;
    if (volumes.length) {
      podSpec.volumes = volumes;
    }
  }
}

export default KubernetesRenderer;
