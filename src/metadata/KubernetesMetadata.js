import { DefaultMetadata } from 'leto-modelizer-plugin-core';
import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';

/**
 * Class to validate and retrieve components definitions from Kubernetes metadata.
 */
class KubernetesMetadata extends DefaultMetadata {
  /**
   * Get all component/link definitions from metadata.
   * @return {Object} - Object that contains component/link definitions.
   */
  parse() {
    this.pluginData.definitions = {
      components: [],
      components: [
        this.getConfigMapDefinition(),
        this.getSecretDefinition(),
        this.getDeploymentDefinition(),
      ],
      links: [],
    };
  }

  getConfigMapDefinition() {
    return new KubernetesComponentDefinition({
      type: 'ConfigMap',
      icon: 'resources/labeled/cm',
      model: 'DefaultModel',
      definedAttributes: [
        {
          name: 'data',
          type: 'Object',
          required: false,
        },
        {
          name: 'binaryData',
          type: 'Object',
          required: false,
        },
        {
          name: 'immutable',
          type: 'Boolean',
          required: false,
        },
      ],
      isContainer: false,
    });
  }

  getSecretDefinition() {
    return new KubernetesComponentDefinition({
      type: 'Secret',
      icon: 'resources/labeled/secret',
      model: 'DefaultModel',
      definedAttributes: [
        {
          name: 'type',
          type: 'String',
          required: false,
          rules: {
            values: [
              'Opaque',
              'kubernetes.io/service-account-token',
              'kubernetes.io/dockercfg',
              'kubernetes.io/dockerconfigjson',
              'kubernetes.io/basic-auth',
              'kubernetes.io/ssh-auth',
              'kubernetes.io/tls',
              'bootstrap.kubernetes.io/token',
            ],
          },
        },
        {
          name: 'data',
          type: 'Object',
          required: false,
        },
        {
          name: 'stringData',
          type: 'Object',
          required: false,
        },
        {
          name: 'immutable',
          type: 'Boolean',
          required: false,
        },
      ],
      isContainer: false,
    });
  }

  getDeploymentDefinition() {
    return new KubernetesComponentDefinition({
      type: 'Secret',
      icon: 'resources/labeled/deploy',
      model: 'DefaultModel',
      definedAttributes: [
        {
          name: 'spec',
          type: 'Object',
          required: true,
          definedAttributes: [
            this.getLabelSelectorAttributeDefinition(),
          ],
        },
      ],
      isContainer: false,
    });
  }

  getLabelSelectorAttributeDefinition() {
    return {
      name: 'selector',
      type: 'String',
      required: true,
      definedAttributes: [
        {
          name: 'matchExpressions',
          type: 'Object',
          required: false,
        },
        {
          name: 'matchLabels',
          type: 'Object',
          required: false,
          definedAttributes: [
            {
              name: 'key',
              type: 'String',
              required: true,
            },
            {
              name: 'operator',
              type: 'String',
              required: true,
            },
            {
              name: 'values',
              type: 'Array',
              required: false,
            },
          ],
        },
      ],
    };
  }
}

export default KubernetesMetadata;
