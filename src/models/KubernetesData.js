import {
  DefaultData,
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';

/**
 * Kubernetes plugin data.
 */
class KubernetesData extends DefaultData {
  /**
   * Create new component.
   *
   * @param {string} id - Component id.
   * @param {ComponentDefinition} definition - Component definition.
   */
  addComponent(id, definition) {
    const name = this.__generateUniqueComponentName(definition.type);
    const component = new Component({id: name, name, definition});
    switch (definition.type) {
      case 'Container':
        component.attributes = [
          this.__createAttribute('isInitContainer', false, definition),
        ];
        break;
    }
    this.components.push(component);
  }

  __generateUniqueComponentName(componentType) {
    const componentNames = this.components.map(({name}) => name);
    for (let i = 0; i <= componentNames.length; i++) {
      const componentName = `${componentType}${i+1}`;
      if (!componentNames.includes(componentName)) {
        return componentName;
      }
    }
  }

  __createAttribute(name, value, parentDefinition) {
    const definition = parentDefinition.definedAttributes.find(
      (attributeDefinition) => attributeDefinition.name === name
    );
    const attribute = new ComponentAttribute({
      name,
      type: definition.type,
      definition,
    });
    attribute.value = value; // not set in constructor, because the value 'false' is replaced by null in the constructor (bug)
    return attribute;
  }
}

export default KubernetesData;
