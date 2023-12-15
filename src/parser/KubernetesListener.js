import {
  Component,
  ComponentAttribute,
  ParseError,
} from 'leto-modelizer-plugin-core';

/**
 * Lidy listener for Kubernetes files.
 */
class KubernetesListener {
  /**
   * Default constructor.
   * @param {KubernetesData} pluginData - Plugin data.
   * @param {string} path - Path of the file parsed by this listener.
   */
  constructor(pluginData, { path }) {
    /**
     * Plugin data.
     * @type {KubernetesData}
     */
    this.pluginData = pluginData;
    /**
     * Path of the file parsed by this listener.
     * @type {string}
     */
    this.path = path;
  }

  /**
   * Function called when attribute "root" is parsed.
   * Create components and attributes recursively from the parsed root element.
   * @param {MapNode} rootNode - The Lidy "root" node.
   */
  exit_root(rootNode) {
    const apiVersion = rootNode?.value.apiVersion?.value;
    const kind = rootNode?.value.kind?.value;

    if (!apiVersion || !kind) {
      this.pluginData.parseErrors.push(new ParseError({
        message: `File "${this.path}" is missing apiVersion or kind.`,
      }));
      return;
    }

    this.__createComponent(rootNode, apiVersion, kind);
  }

  /**
   * Create components with attributes recursively from a Lidy component tree node.
   * @param {MapNode} componentNode - Lidy node containing the component's properties.
   * @param {string} apiVersion - Kubernetes API version of the component definition.
   * @param {string} kind - Kubernetes resource kind (type of component).
   * @returns {Component} The newly created component corresponding to the given node.
   */
  __createComponent(componentNode, apiVersion, kind) {
    const definition = this.pluginData.definitions.components
      .find((def) => def.apiVersion === apiVersion && def.type === kind)
        || this.pluginData.definitions.components.find(({ type }) => type === 'UnknownResource');

    const component = new Component({
      id: componentNode.value.metadata?.value.name?.value || componentNode.value.name?.value
        || this.pluginData.generateComponentId(definition),
      definition,
      path: this.path,
    });
    this.pluginData.components.push(component);
    component.attributes = this.__createAttributes(componentNode, definition, component);

    return component;
  }

  /**
   * Create attributes and children components recursively from a Lidy attribute tree node.
   * @param {MapNode|ListNode} parentNode - Lidy node containing the properties of the parent
   * component or attribute.
   * @param {KubernetesComponentDefinition|KubernetesComponentAttributeDefinition} parentDefinition
   * - Definition of the parent component or attribute.
   * @param {Component} component - The component that the attributes belong to.
   * @returns {ComponentAttribute[]} The newly created attributes corresponding to the parent node's
   * direct children attributes.
   */
  __createAttributes(parentNode, parentDefinition, component) {
    return Object.keys(parentNode.value)
      .filter((attributeName) => !parentDefinition?.ignoredAttributes.includes(attributeName))
      .reduce((acc, attributeName) => {
        const attributeNode = parentNode.value[attributeName];
        const definition = parentDefinition?.definedAttributes
          .find(({ name }) => name === (parentNode.type !== 'list' ? attributeName : null)); // Object definitions inside an Array definition currently have name=null currently (ArrayOfObjects old format)

        const childComponentIndex = component.definition.childrenIndex
          .find((childIndex) => childIndex.attributeName === attributeName);
        if (childComponentIndex) {
          const childrenComponentsNodes = attributeNode.type !== 'list' ? [attributeNode] : attributeNode.value;
          this.__createChildrenComponents(childrenComponentsNodes, childComponentIndex, component);
          return acc;
        }

        let value;
        if (attributeNode.type === 'map' || (attributeNode.type === 'list' && attributeNode.value[0]?.type === 'map')) {
          value = this.__createAttributes(attributeNode, definition, component);
        } else if (attributeNode.type === 'list') {
          value = attributeNode.value.map((node) => node.value);
        } else {
          value = attributeNode.value;
        }
        const attribute = new ComponentAttribute({
          name: parentNode.type !== 'list' ? attributeName : null,
          type: this.__lidyToLetoType(attributeNode.type),
          definition,
          value,
        });
        if (definition?.type === 'Link') {
          // Leto expects Link attributes to be Arrays.
          attribute.type = 'Array';
          if (!Array.isArray(attribute.value)) {
            attribute.value = [attribute.value];
          }
        }
        acc.push(attribute);
        return acc;
      }, []);
  }

  /**
   * Create children components with attributes recursively from Lidy component tree nodes.
   * @param {MapNode[]} componentNodes - Lidy nodes containing the children components' properties.
   * @param {object} childComponentIndex - Data about the children components to create.
   * @param {string} [childComponentIndex.componentType] - Type of the children components.
   * @param {string} [childComponentIndex.attributeName] - Name of the attribute containing the
   * children components' properties.
   * @param {Component} parentComponent - The parent component.
   */
  __createChildrenComponents(componentNodes, { componentType, attributeName }, parentComponent) {
    const definition = this.pluginData.definitions.components
      .find(({ type }) => type === componentType);

    componentNodes.forEach((componentNode) => {
      const { apiVersion, type } = definition;
      const component = this.__createComponent(componentNode, apiVersion, type);
      component.setReferenceAttribute(parentComponent);

      if (definition.type === 'Container') {
        // Add Boolean attribute to differentiate containers from initContainers.
        component.attributes.push(new ComponentAttribute({
          name: 'isInitContainer',
          type: 'Boolean',
          definition: definition.definedAttributes
            .find(({ name }) => name === 'isInitContainer'),
          value: attributeName === 'initContainers',
        }));
      }
    });
  }

  /**
   * Convert a Lidy node type name to a Leto attribute type name.
   * @param {string} lidyType - Lidy node type name.
   * @returns {string} Leto attribute type name.
   */
  __lidyToLetoType(lidyType) {
    switch (lidyType) {
      case 'string':
        return 'String';
      case 'boolean':
        return 'Boolean';
      case 'int':
      case 'float':
        return 'Number';
      case 'map':
        return 'Object';
      case 'list':
        return 'Array';
      default:
        return null;
    }
  }

  /**
   * Function called when attribute "uint16" is parsed.
   * Throw an error if the value is not in the range of uint16.
   * @param {number} value - The "uint16" value to check.
   */
  exit_uint16({ value }) {
    if (value < 0 || value >= 2 ** 16) {
      // TODO: throw error
    }
  }
}

export default KubernetesListener;
