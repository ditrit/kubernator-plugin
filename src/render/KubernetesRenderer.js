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
    return this.getRootComponents().map((component) =>
      new FileInput({
        path: component.path || `${component.name}.yaml`,
        content: yaml.dump(this.formatComponent(component, true, 'metadata')),
      })
    );
  }

  getRootComponents() {
    const rootComponents = [...this.pluginData.components];
    this.pluginData.components.forEach((component) => {
      this.pluginData.getChildren(component.id).forEach((childComponent) => {
        delete rootComponents[rootComponents.indexOf(childComponent)];
      });
    });
    return rootComponents;
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
    this.insertChildComponentsAttributes(formatted, component);

    return formatted;
  }

  formatAttributes(attributes) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value);
      } else if (attribute.type === 'Array') {
        acc[attribute.name] = Object.values(this.formatAttributes(attribute.value));
      } else if (attribute.type === 'Link') {
        acc[attribute.name] = attribute.value[0]; // Link attributes are arrays, but we don't want the rendered value to be an array
      } else if (attribute.definition?.type == 'Reference') {
        // Drop attribute in rendered file
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
      formatted.spec ||= {};
      formatted.spec.selector ||= {};
      formatted.spec.template ||= {};
    } else if (component.definition.type === 'ConfigMapMount') {
      formatted.configMap ||= {};
    } else if (component.definition.type === 'SecretMount') {
      formatted.secret ||= {};
    } else if (component.definition.type === 'PersistentVolumeClaimMount') {
      formatted.persistentVolumeClaim ||= {};
    }
  }

  insertChildComponentsAttributes(formatted, component) {
    const childComponents = this.pluginData.getChildren(component.id);
    if (!childComponents.length) {
      return;
    }
    switch (component.definition.type) {
      case 'Deployment':
        const podComponent = childComponents[0];
        // FIXME: what if there are multiple Pod children?
        // For now, we can ignore them, but later we will need a way
        // to limit the number of children at metadata level
        formatted.spec.template = this.formatComponent(podComponent, false, 'metadata');
        break;
      case 'Pod':
        this.insertPodChildComponentsAttributes(formatted, component, childComponents);
        break;
      case 'Container':
      case 'InitContainer':
        const volumeComponents = childComponents;
        formatted.volumeMounts = volumeComponents.map((volumeComponent) => {
          const formattedVolumeMount = this.formatComponent(
            volumeComponent, false, 'simple'
          );
          // Split volumes and volumeMounts attributes : volumeMounts should contain name, other non-object attributes (mountPath, propagation, ...)
          Object.keys(formattedVolumeMount).forEach((key) => {
            if (typeof formattedVolumeMount[key] === 'object') {
              delete formattedVolumeMount[key];
            }
          })
          return formattedVolumeMount;
        });
        break;
    }
  }

  insertPodChildComponentsAttributes(formatted, component, childComponents) {
    const podSpec = formatted.spec || {};
    const volumes = [];
    const k8sContainerTypes = [
      {kind: 'InitContainer', attributeName: 'initContainers'},
      {kind: 'Container', attributeName: 'containers'},
    ];
    k8sContainerTypes.forEach((k8sContainerType) => {
      const k8sContainerComponents = childComponents.filter(
        (component) => component.definition.type === k8sContainerType.kind
      );
      if (k8sContainerComponents.length) {
        podSpec[k8sContainerType.attributeName] = k8sContainerComponents.map(
          (k8sContainerComponent) => {
            const formattedContainer = this.formatComponent(
              k8sContainerComponent, false, 'simple'
            );
            const volumeComponents =
              this.pluginData.getChildren(k8sContainerComponent.id);
            volumes.push(...volumeComponents.map(
              (volumeComponent) => {
                const formattedVolume =
                  this.formatComponent(volumeComponent, false, 'simple');
                // Split volumes and volumeMounts attributes : volumes should only contain name and an object (configMap, secret, ...)
                Object.keys(formattedVolume).forEach((key) => {
                  if (typeof formattedVolume[key] !== 'object' && key !== 'name') {
                    delete formattedVolume[key];
                  }
                })
                return formattedVolume;
              }
            ));
            return formattedContainer;
          }
        );
      }
    });
    if (volumes.length) {
      podSpec.volumes = volumes;
    }
    formatted.spec = podSpec;
  }
}

export default KubernetesRenderer;
