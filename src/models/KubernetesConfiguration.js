import {
  DefaultConfiguration,
  Tag,
} from 'leto-modelizer-plugin-core';

/**
 * Kubernator configuration.
 */
class KubernetesConfiguration extends DefaultConfiguration {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   */
  constructor(props) {
    super({
      ...props,
      defaultFileName: 'manifest.yaml',
      defaultFileExtension: 'yaml',
      tags: [
        new Tag({ type: 'language', value: 'Kubernetes' }),
        new Tag({ type: 'category', value: 'Infrastructure' }),
        new Tag({ type: 'category', value: 'Containers' }),
      ],
      isFolderTypeDiagram: true,
    });
  }
}

export default KubernetesConfiguration;
