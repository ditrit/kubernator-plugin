
import { ComponentDefinition, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';

describe('KubernetesData', () => {
  let data;

  beforeEach(() => {
    data = new KubernetesData();
  });

  describe('addComponent', () => {
    it('should add a new component and return the generated ID', () => {
      const definition = new ComponentDefinition({ type: 'Container' }); // Create a component definition

      const id = data.addComponent(definition); // Add the component and get the returned ID

      expect(id).toBeDefined(); // Check if the ID is defined

      // Find the added component in the components array
      const addedComponent = data.components.find((component) => component.id === id);
      // Check if the added component is defined
      expect(addedComponent).toBeDefined(); 
      // Check if the added component has the correct ID
      expect(addedComponent.id).toBe(id); 
      // Check if the added component has the correct definition
      expect(addedComponent.definition).toBe(definition);
      // Check if the added component has the correct attributes
      expect(addedComponent.attributes.length).toBe(1);
    });

  });

  describe('__createAttribute', () => {
    it('should create a new component attribute', () => {
      const attributeDefinition = {
        name: 'isInitContainer',
        type: 'Boolean',
      };
      const parentDefinition = {
        definedAttributes: [attributeDefinition],
      };
      const attributeName = 'isInitContainer';
      const attributeValue = true;

      const attribute = data.__createAttribute(attributeName, attributeValue, parentDefinition);

       // Check if the attribute is an instance of ComponentAttribute
      expect(attribute).toBeInstanceOf(ComponentAttribute);
      // Check if the attribute has the correct name
      expect(attribute.name).toBe(attributeName); 
      // Check if the attribute has the correct value
      expect(attribute.value).toBe(attributeValue); 
      // Check if the attribute has the correct type
      expect(attribute.type).toBe(attributeDefinition.type); 
       // Check if the attribute has the correct definition
      expect(attribute.definition).toBe(attributeDefinition);
    });

    it('should return null for non-existent attribute definition', () => {
      const attributeDefinition = {
        name: 'isInitContainer',
        type: 'Boolean',
      };
      const parentDefinition = {
        definedAttributes: [attributeDefinition],
      };
      const attributeName = 'nonExistentAttribute';
      const attributeValue = true;

      const attribute = data.__createAttribute(attributeName, attributeValue, parentDefinition);

      // Check if the attribute is null for non-existent attribute definition
      expect(attribute).toBeNull(); 
    });
  });
});
