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
   * @param {ComponentDefinition} definition - Component definition.
   * @param {string} [folder=''] - Folder path.
   * @param {string} [fileName] - File name.
   * @returns {string} Component id.
   */
  addComponent(definition, folder = '', fileName = this.defaultFileName || '') {
    const id = this.generateComponentId(definition);
    const component = new Component({
      id,
      definition,
      path: `${folder}${id}.yaml`,
    });

    switch (definition.type) {
      case 'Container':
        component.attributes = [
          this.__createAttribute('isInitContainer', false, definition),
        ];
        break;
    }
    this.components.push(component);

    return id;
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
