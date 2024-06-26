import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';
import KubernetesComponentAttributeDefinition from 'src/models/KubernetesComponentAttributeDefinition';

// eslint-disable-next-line global-require
jest.mock('src/assets/metadata', () => require('tests/resources/metadata/sample.json'));

describe('Test class: KubernetesMetadata', () => {
  describe('Test method: parse', () => {
    it('Should parse sample metadata file and set expected component definitions into pluginData', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const commonAttributes = [
        new KubernetesComponentAttributeDefinition({
          name: 'metadata',
          displayName: 'Metadata',
          type: 'Object',
          expanded: true,
          definedAttributes: [
            new KubernetesComponentAttributeDefinition({
              name: 'namespace',
              displayName: 'Namespace',
              type: 'String',
              description: 'Namespace defines the space within which each name must be unique.<br/>An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation.<br/>Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.<br/><br/>Must be a DNS_LABEL. Cannot be updated.',
              url: 'http://kubernetes.io/docs/user-guide/namespaces',
            }),
            new KubernetesComponentAttributeDefinition({
              name: 'labels',
              displayName: 'Labels',
              type: 'Object',
              definedAttributes: [
                new KubernetesComponentAttributeDefinition({
                  name: 'app.kubernetes.io/name',
                  displayName: 'app.kubernetes.io/name',
                  type: 'String',
                }),
                new KubernetesComponentAttributeDefinition({
                  name: 'app.kubernetes.io/instance',
                  displayName: 'app.kubernetes.io/instance',
                  type: 'String',
                }),
              ],
            }),
            new KubernetesComponentAttributeDefinition({
              name: 'annotations',
              displayName: 'Annotations',
              type: 'Object',
            }),
          ],
        }),
      ];

      expect(pluginData.definitions.components).toStrictEqual([
        new KubernetesComponentDefinition({
          type: 'myComponent1',
          apiVersion: 'networking.k8s.io/v1',
          ignoredAttributes: ['apiVersion', 'kind', 'name', 'status'],
          definedAttributes: [
            ...commonAttributes,
            new KubernetesComponentAttributeDefinition({
              name: 'isInitContainer',
              displayName: 'Is Init Container',
              type: 'Boolean',
            }),
            new KubernetesComponentAttributeDefinition({
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
          ignoredAttributes: ['apiVersion', 'kind', 'name', 'status'],
          definedAttributes: [
            ...commonAttributes,
            new KubernetesComponentAttributeDefinition({
              name: 'hosts',
              displayName: 'Hosts',
              type: 'Array',
            }),
            new KubernetesComponentAttributeDefinition({
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
          ignoredAttributes: ['apiVersion', 'kind', 'name', 'status'],
          definedAttributes: [
            // no commonAttributes for apiVersion 'others'
            new KubernetesComponentAttributeDefinition({
              name: 'ports',
              displayName: 'Ports',
              type: 'Array',
              definedAttributes: [
                new KubernetesComponentAttributeDefinition({
                  name: null,
                  displayName: null,
                  type: 'Object',
                  definedAttributes: [
                    new KubernetesComponentAttributeDefinition({
                      name: 'name',
                      displayName: 'Name',
                      type: 'String',
                    }),
                    new KubernetesComponentAttributeDefinition({
                      name: 'protocol',
                      displayName: 'Protocol',
                      type: 'String',
                      rules: {
                        values: ['TCP', 'UDP', 'SCTP'],
                      },
                    }),
                    new KubernetesComponentAttributeDefinition({
                      name: 'port',
                      displayName: 'Port',
                      type: 'Number',
                      required: true,
                    }),
                    new KubernetesComponentAttributeDefinition({
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

        new KubernetesComponentDefinition({
          type: 'myComponent4',
          apiVersion: 'others',
          ignoredAttributes: ['apiVersion', 'kind', 'name', 'status'],
          definedAttributes: [],
        }),
      ]);
    });
  });
});
