import { ComponentAttributeDefinition } from '@ditrit/leto-modelizer-plugin-core';

/**
 * Specific Kubernetes component attribute definition.
 */
class KubernetesComponentAttributeDefinition extends ComponentAttributeDefinition {
  /**
   * Override ComponentAttributeDefinition constructor with additional properties.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string[]} [props.ignoredAttributes] - Name of attributes ignored during parsing.
   */
  constructor(props = {
    ignoredAttributes: [],
  }) {
    super(props);
    /**
     * Name of attributes ignored during parsing.
     * @type {string[]}
     */
    this.ignoredAttributes = props.ignoredAttributes || [];
  }
}

export default KubernetesComponentAttributeDefinition;
