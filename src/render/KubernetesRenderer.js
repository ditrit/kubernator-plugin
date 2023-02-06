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
  renderFiles() {
    console.log('R', this.pluginData.components);
    return this.pluginData.components.filter(
      (component) => !component.getContainerId()
    ).map((component) =>
      new FileInput({
        path: component.path,
        content: yaml.dump(this.formatComponent(component, true, true)),
      })
    );
  }

  formatComponent(component, hasKindAndApiVersion, hasMetadata) {
    let formatted = this.formatAttributes(component.attributes, component);
    formatted = this.insertComponentName(formatted, component, hasMetadata);

    if (hasKindAndApiVersion) {
      formatted = this.insertFront(
        formatted, 'kind', component.definition.type
      );
      formatted = this.insertFront(
        formatted, 'apiVersion', component.definition.apiVersion
      );
    }
    this.insertChildComponentsAttributes(formatted, component);
    this.insertDefaultValues(formatted, component, hasMetadata);

    return formatted;
  }

  formatAttributes(attributes, component) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value, component);
      } else if (attribute.type === 'Array') {
        acc[attribute.name] = Object.values(this.formatAttributes(attribute.value, component));
      } else if (attribute.type === 'Link') {
        if (attribute.name === 'selector') {
          acc[attribute.name] =
            this.formatSelectorLinkAttribute(attribute, component);
        } else {
          acc[attribute.name] = attribute.value[0]; // Link attributes are arrays, but we don't want the rendered value to be an array
        }
      } else if (attribute.definition?.type === 'Reference') {
        // Drop attribute in rendered file
      } else {
        acc[attribute.name] = attribute.value;
      }
      return acc;
    }, {});
  }

  formatSelectorLinkAttribute(attribute, component) {
    if (!attribute.value?.length) {
      return {};
    }
    switch (component.definition.type) {
      case 'Service':
        return this.__formatSelectorLinkAttribute(attribute);
      default:
        throw new Error(`Unknown selector in component '${component.id}'.`);
    }
  }

  __formatSelectorLinkAttribute(attribute) {
    const targetComponentId = attribute.value[0];
    // TODO: compute intersection of all linked components' labels,
    // instead of only considering the first one.
    const targetComponent = this.pluginData.getComponentById(targetComponentId);
    if (!targetComponent) {
      throw new Error(`Target component not found '${targetComponentId}'.`);
    }
    const targetLabelsAttribute = targetComponent.attributes.find(
      ({name}) => name === 'metadata'
    )?.value?.find(
      ({name}) => name === 'labels'
    )?.value;
    if (!targetLabelsAttribute?.length) {
      return {'app.kubernetes.io/name': targetComponent.id};
    }
    return this.formatAttributes(targetLabelsAttribute, targetComponent);
  }

  insertComponentName(formatted, component, hasMetadata) {
    if (hasMetadata) {
      // For all top level components, the name is stored in the metadata object.
      // Nested Pods and Jobs also have their name in the metadata object.
      formatted = this.insertFront(
        formatted, 'metadata', this.insertFront(
          formatted.metadata || {}, 'name', component.id,
        )
      );
    } else {
      // For some nested components (Container, VolumeMounts, ...) the name is stored directly in its main object.
      formatted = this.insertFront(formatted, 'name', component.id);
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

  insertChildComponentsAttributes(formatted, component) {
    const childComponents = this.pluginData.getChildren(component.id);
    if (!childComponents.length) {
      return;
    }
    switch (component.definition.type) {
      case 'Deployment':
      case 'StatefulSet':
      case 'Job':
        const podComponent = childComponents[0];
        // FIXME: what if there are multiple Pod children?
        // For now, we can ignore them, but later we will need a way
        // to limit the number of children at metadata level
        formatted.spec ||= {};
        formatted.spec.template = this.formatComponent(podComponent, false, true);
        break;
      case 'Pod':
        this.insertPodChildComponentsAttributes(formatted, childComponents);
        break;
      case 'Container':
        const volumeComponents = childComponents;
        formatted.volumeMounts = volumeComponents.map((volumeComponent) => {
          const formattedVolumeMount = this.formatComponent(
            volumeComponent, false, false
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
      case 'CronJob':
        const jobComponent = childComponents[0];
        // FIXME: what if there are multiple Job children? => same as for Pods in Deployments
        formatted.spec ||= {};
        formatted.spec.jobTemplate = this.formatComponent(jobComponent, false, true);
        break;
    }
  }

  insertDefaultValues(formatted, component, hasMetadata) {
    if (hasMetadata) {
      // Set at least one label to be able to use Link selectors.
      formatted.metadata.labels ||= {
        'app.kubernetes.io/name': component.id
      };
    }
    switch (component.definition.type) {
      case "Deployment":
      case "StatefulSet":
      case "Job":
        formatted.spec ||= {};
        formatted.spec.selector ||= {};
        formatted.spec.selector.matchLabels =
          {...formatted.spec.template?.metadata?.labels} || {};
        formatted.spec.template ||= {};
        break;
      case "Pod":
        formatted.spec ||= {};
        formatted.spec.containers ||= [];
        break;
      case "ConfigMapMount":
        formatted.configMap ||= {};
        break;
      case "SecretMount":
        formatted.secret ||= {};
        break;
      case "PersistentVolumeClaimMount":
      formatted.persistentVolumeClaim ||= {};
        break;
      case "Service":
        formatted.spec ||= {};
        formatted.spec.ports ||= [];
        break;
      case "CronJob":
        formatted.spec ||= {};
        formatted.spec.jobTemplate ||= {};
        break;
    }
  }

  insertPodChildComponentsAttributes(formatted, childComponents) {
    formatted.spec ||= {};
    const volumes = [];
    ['initContainers', 'containers'].forEach((k8sContainerAttributeName) => {
      const k8sContainerComponents = childComponents.filter(
        (k8sContainerComponent) => {
          const isInitContainer =
            k8sContainerComponent.getAttributeByName('isInitContainer').value;
          return k8sContainerComponent.definition.type === 'Container'
            && isInitContainer === (k8sContainerAttributeName === 'initContainers')
        }
      );
      if (k8sContainerComponents.length) {
        formatted.spec[k8sContainerAttributeName] = k8sContainerComponents.map(
          (k8sContainerComponent) => {
            const formattedContainer = this.formatComponent(
              k8sContainerComponent, false, false
            );
            delete formattedContainer.isInitContainer;
            const volumeComponents =
              this.pluginData.getChildren(k8sContainerComponent.id);
            volumes.push(...volumeComponents.map(
              (volumeComponent) => {
                const formattedVolume =
                  this.formatComponent(volumeComponent, false, false);
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
      formatted.spec.volumes = volumes;
    }
  }
}

export default KubernetesRenderer;
