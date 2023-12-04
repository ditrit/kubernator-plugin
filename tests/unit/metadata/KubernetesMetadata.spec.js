import { ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';

// eslint-disable-next-line global-require
jest.mock('src/assets/metadata', () => require('tests/resources/metadata/sample.json'));

describe('Test class: KubernetesMetadata', () => {
  describe('Test method: parse', () => {
    it('Should return valid content when parsing sample metadata', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.metadata = {};
      metadata.parse();

      const commonAttributes = [
        new ComponentAttributeDefinition({
          name: 'metadata',
          displayName: 'Metadata',
          type: 'Object',
          expanded: true,
          definedAttributes: [
            new ComponentAttributeDefinition({
              name: 'namespace',
              displayName: 'Namespace',
              type: 'String',
              description: 'Namespace defines the space within which each name must be unique.<br/>An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation.<br/>Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.<br/><br/>Must be a DNS_LABEL. Cannot be updated.',
              url: 'http://kubernetes.io/docs/user-guide/namespaces',
            }),
            new ComponentAttributeDefinition({
              name: 'labels',
              displayName: 'Labels',
              type: 'Object',
              definedAttributes: [
                new ComponentAttributeDefinition({
                  name: 'app.kubernetes.io/name',
                  displayName: 'app.kubernetes.io/name',
                  type: 'String',
                }),
                new ComponentAttributeDefinition({
                  name: 'app.kubernetes.io/instance',
                  displayName: 'app.kubernetes.io/instance',
                  type: 'String',
                }),
              ],
            }),
            new ComponentAttributeDefinition({
              name: 'annotations',
              displayName: 'Annotations',
              type: 'Object',
            }),
          ],
        }),
      ];

      expect(pluginData.definitions.components).toEqual([
        new KubernetesComponentDefinition({
          type: 'myComponent1',
          apiVersion: 'networking.k8s.io/v1',
          definedAttributes: [
            ...commonAttributes,
            new ComponentAttributeDefinition({
              name: 'isInitContainer',
              displayName: 'Is Init Container',
              type: 'Boolean',
            }),
            new ComponentAttributeDefinition({
              name: 'selector',
              displayName: 'Selector',
              type: 'Link',
              linkRef: 'myComponent2',
            }),
          ],
        }),

        new KubernetesComponentDefinition({
          type: 'myComponent2',
          apiVersion: 'networking.k8s.io/v1',
          parentTypes: ['myComponent3'],
          definedAttributes: [
            ...commonAttributes,
            new ComponentAttributeDefinition({
              name: 'hosts',
              displayName: 'Hosts',
              type: 'Array',
            }),
            new ComponentAttributeDefinition({
              name: 'parent',
              displayName: 'Parent',
              type: 'Reference',
              containerRef: 'myComponent3',
            }),
          ],
        }),

        new KubernetesComponentDefinition({
          type: 'myComponent3',
          apiVersion: 'others',
          isContainer: true,
          childrenTypes: ['myComponent2'],
          definedAttributes: [
            // no commonAttributes for apiVersion 'others'
            new ComponentAttributeDefinition({
              name: 'ports',
              displayName: 'Ports',
              type: 'Array',
              definedAttributes: [
                new ComponentAttributeDefinition({
                  name: null,
                  displayName: null,
                  type: 'Object',
                  definedAttributes: [
                    new ComponentAttributeDefinition({
                      name: 'name',
                      displayName: 'Name',
                      type: 'String',
                    }),
                    new ComponentAttributeDefinition({
                      name: 'protocol',
                      displayName: 'Protocol',
                      type: 'String',
                      rules: {
                        values: ['TCP', 'UDP', 'SCTP'],
                      },
                    }),
                    new ComponentAttributeDefinition({
                      name: 'port',
                      displayName: 'Port',
                      type: 'Number',
                      required: true,
                    }),
                    new ComponentAttributeDefinition({
                      name: 'targetPort',
                      displayName: 'Target Port',
                      type: 'String',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
  });
});
