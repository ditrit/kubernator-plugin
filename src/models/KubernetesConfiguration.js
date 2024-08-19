import {
  DefaultConfiguration,
  Tag,
} from '@ditrit/leto-modelizer-plugin-core';

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
      extraResources: [{
        type: 'markers',
        name: 'startLinkMarker',
      }, {
        type: 'markers',
        name: 'endLinkMarker',
      }, {
        type: 'links',
        name: 'defaultLink',
      }, {
        type: 'links',
        name: 'temporaryLink',
      }, {
        type: 'icons',
        name: 'error',
      }, {
        type: 'icons',
        name: 'menu',
      }, {
        type: 'icons',
        name: 'resize',
      }],
      container: {
        margin: 15,
        gap: 50,
      },
      i18n: {
        'en-US': {
          displayName: 'Kubernetes',
        },
      },
    });
  }
}

export default KubernetesConfiguration;
