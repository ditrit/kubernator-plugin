import { ComponentDefinition } from 'leto-modelizer-plugin-core';

/**
 * Specific Kubernetes component definition.
 */
class KubernetesComponentDefinition extends ComponentDefinition {
  /**
   * Override ComponentDefinition constructor with additional properties.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.apiVersion] - Kubernetes API version (<apiGroup>/<version>).
   * @param {object[]} [props.childrenIndex] - Indicate the name of the spec attributes in which
   * children components should be positioned, to help with parsing/rendering.
   * @param {string} [props.childrenIndex[].attributeName] - Name of the attribute inside spec.
   * @param {string} [props.childrenIndex[].componentType] - Type of child component.
   * @param {string[]} [props.ignoredAttributes] - Name of attributes ignored during parsing.
   */
  constructor(props = {
    apiVersion: null,
    childrenIndex: [],
    ignoredAttributes: [],
  }) {
    super(props);
    /**
     * Kubernetes API version (<apiGroup>/<version>).
     * @type {string}
     */
    this.apiVersion = props.apiVersion || null;
    /**
     * Indicate the name of the spec attributes in which children components should be positioned,
     * to help with parsing/rendering.
     * @type {object[]}
     */
    this.childrenIndex = props.childrenIndex || [];
    /**
     * Name of attributes ignored during parsing.
     * @type {string[]}
     */
    this.ignoredAttributes = props.ignoredAttributes || [];
  }
}

export default KubernetesComponentDefinition;
