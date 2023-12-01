import { ComponentDefinition } from 'leto-modelizer-plugin-core';

/**
 * Specific Kubernetes component definition.
 */
class KubernetesComponentDefinition extends ComponentDefinition {
  /**
   * Override ComponentDefinition constructor with apiVersion property.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.apiVersion] - Kubernetes apiVersion (<apiGroup>/<version>).
   */
  constructor(props = {
    apiVersion: null,
  }) {
    super(props);
    /**
     * Kubernetes apiVersion (<apiGroup>/<version>)
     * @type {string}
     */
    this.apiVersion = props.apiVersion || null;
  }
}

export default KubernetesComponentDefinition;
