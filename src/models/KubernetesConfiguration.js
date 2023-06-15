import { DefaultConfiguration } from 'leto-modelizer-plugin-core';

/**
 * Terrator configuration.
 */
class KubernetesConfiguration extends DefaultConfiguration {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   */
  constructor(props) {
    super({
      ...props,
      tags: ['Kubernetes', 'Infrastructure', 'Containers'],
    });
  }
}

export default KubernetesConfiguration;
