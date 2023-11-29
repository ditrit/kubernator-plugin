import { ComponentDefinition } from 'leto-modelizer-plugin-core';

/**
 * Kubernetes component definition.
 */
class KubernetesComponentDefinition extends ComponentDefinition {
  /**
   * Default constructor.
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
    this.apiVersion = props.apiVersion;
  }
}

export default KubernetesComponentDefinition;
