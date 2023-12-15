import yaml from 'js-yaml';
import {
  DefaultRender,
  FileInput,
} from 'leto-modelizer-plugin-core';

/**
 * Class to render Kubernetes files from components.
 */
class KubernetesRenderer extends DefaultRender {
  /**
   * Convert all provided components to Kubernetes files.
   * @param {string} [parentEventId] - Parent event id.
   * @returns {FileInput[]} Array of files generated from components.
   */
  renderFiles(parentEventId = null) {
    return this.pluginData.components
      .filter((component) => !component.getContainerId())
      .map((component) => {
        const eventId = this.pluginData.emitEvent({
          parent: parentEventId,
          type: 'Render',
          action: 'write',
          status: 'running',
          files: [component.path],
          data: {
            global: false,
          },
        });
        const file = new FileInput({
          path: component.path,
          content: yaml.dump(this.__formatComponent(component, false), {
            lineWidth: -1,
            noRefs: true,
          }),
        });
        this.pluginData.emitEvent({ id: eventId, status: 'success' });
        return file;
      });
  }

  __formatComponent(component, isChildComponent) {
    let formatted = this.__formatAttributes(component.attributes);

    if (component.definition.apiVersion === 'others') {
      // Components in apiVersion "others" don't have a metadata attribute, only a name.
      formatted = this.__insertFront(formatted, 'name', component.id);
    } else {
      formatted = this.__insertFront(formatted, 'metadata', this.__insertFront(formatted.metadata || {}, 'name', component.id));
      if (!Object.keys(formatted.metadata.labels || {}).length) {
        // Set at least one label to be able to use selectors for Links.
        formatted.metadata.labels = { 'app.kubernetes.io/name': component.id };
      }
    }
    if (!isChildComponent) {
      formatted = this.__insertFront(formatted, 'kind', component.definition.type);
      formatted = this.__insertFront(formatted, 'apiVersion', component.definition.apiVersion);
    }

    this.__insertChildComponentsAttributes(formatted, component);

    if (['Deployment', 'StatefulSet', 'Job'].includes(component.definition.type)) {
      const template = formatted.spec?.template;
      if (template) {
        formatted.spec ||= {};
        formatted.spec.selector ||= {};
        formatted.spec.selector.matchLabels = template.metadata.labels;
        delete formatted.spec.template; // delete to reorder
        formatted.spec.template = template;
      }
    }

    return formatted;
  }

  __formatAttributes(attributes) {
    return attributes.reduce((acc, attribute, i) => {
      if (attribute.type === 'Object') {
        acc[attribute.name || i] = this.__formatAttributes(attribute.value);
      } else if (attribute.definition?.type === 'Link') {
        acc[attribute.name] = attribute.name === 'selector'
          ? this.__formatSelectorLinkAttribute(attribute)
          : attribute.value[0]; // Link attributes are Arrays, but we want a single String
      } else if (attribute.type === 'Array') {
        acc[attribute.name] = attribute.value[0]?.type === 'Object'
          ? Object.values(this.__formatAttributes(attribute.value))
          : attribute.value;
      } else if (attribute.definition?.type === 'Reference' || attribute.name === 'isInitContainer') {
        // Reference and isInitContainer attributes are dropped
      } else {
        acc[attribute.name] = attribute.value;
      }
      return acc;
    }, {});
  }

  __formatSelectorLinkAttribute(attribute) {
    if (!attribute.value?.length) {
      return {};
    }
    const targetComponentId = attribute.value[0];
    // ^ TODO: compute intersection of all linked components' labels,
    // instead of only considering the first one.
    const targetComponent = this.pluginData.getComponentById(targetComponentId);
    if (!targetComponent) {
      throw new Error(`Target component not found '${targetComponentId}'.`);
    }
    const targetLabelsAttribute = targetComponent.attributes
      .find(({ name }) => name === 'metadata')?.value
      ?.find(({ name }) => name === 'labels')?.value;
    if (!targetLabelsAttribute?.length) {
      return { 'app.kubernetes.io/name': targetComponent.id };
    }
    return this.__formatAttributes(targetLabelsAttribute);
  }

  __insertChildComponentsAttributes(formatted, component) {
    if (!component.definition.definedAttributes.find(({ name }) => name === 'spec')) {
      return; // children components are only inserted in components with a spec attribute
    }
    const childComponents = this.pluginData.getChildren(component.id);

    component.definition.childrenIndex.forEach(({ attributeName, componentType }) => {
      const childComponentsOfType = childComponents
        .filter(({ definition }) => definition.type === componentType);

      if (childComponentsOfType.length) {
        formatted.spec ||= {};

        if (component.definition.type === 'Pod') {
          // Children of Pods are either init containers or containers (both are of type Container).
          const isInitContainer = attributeName === 'initContainers';
          const k8sContainerComponents = childComponentsOfType
            .filter((child) => child.getAttributeByName('isInitContainer').value === isInitContainer);
          if (k8sContainerComponents.length) {
            formatted.spec[attributeName] = k8sContainerComponents
              .map((child) => this.__formatComponent(child, true));
          }
        } else {
          formatted.spec[attributeName] = this.__formatComponent(childComponentsOfType[0], true);
          // FIXME: what if there are multiple children? ------------------------------^
          // For now we only consider the first child, because all components except Pod can only
          // have one child (from K8S schema), but it would be better to be able to limit the number
          // of children in a Leto container component from metadata.
        }
      }
    });
  }

  __insertFront(object, key, value) {
    delete object[key];
    return {
      [key]: value,
      ...object,
    };
  }
}

export default KubernetesRenderer;
