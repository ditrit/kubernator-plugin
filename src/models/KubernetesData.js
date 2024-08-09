import {
  DefaultData,
  Component,
  ComponentAttribute,
} from '@ditrit/leto-modelizer-plugin-core';

/**
 * Kubernetes plugin data.
 */
class KubernetesData extends DefaultData {
  /**
   * Create new component, and set its path and default attributes.
   * @param {KubernetesComponentDefinition} definition - Component definition.
   * @param {string} diagramPath - Diagram path.
   * @returns {string} The new component's id.
   */
  addComponent(definition, diagramPath) {
    const id = this.generateComponentId(definition);
    const component = new Component({
      id,
      name: id,
      definition,
      path: diagramPath ? `${diagramPath}/${id}.yaml` : `${id}.yaml`,
    });
    if (definition.type === 'Container') {
      component.attributes = [
        this.__createAttribute('isInitContainer', false, definition),
      ];
    }
    this.components.push(component);
    return id;
  }

  /**
   * Helper to create a ComponentAttribute and automatically set its definition.
   * @param {string} name - Name of the attribute.
   * @param {string} value - Value of the attribute.
   * @param {KubernetesComponentDefinition|KubernetesComponentAttributeDefinition} parentDefinition
   * - The definition of the parent component or attribute.
   * @returns {ComponentAttribute} The newly created ComponentAttribute.
   */
  __createAttribute(name, value, parentDefinition) {
    const definition = parentDefinition.definedAttributes
      .find((attributeDefinition) => attributeDefinition.name === name);
    return new ComponentAttribute({
      name,
      value,
      type: definition.type,
      definition,
    });
  }
}

export default KubernetesData;
