import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import { Component, ComponentAttribute, DefaultData } from 'leto-modelizer-plugin-core';

const pluginData = new DefaultData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const podDef = pluginData.definitions.components
  .find(({ type }) => type === 'Pod');
const podMetadataDef = podDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const podSpecDef = podDef.definedAttributes
  .find(({ name }) => name === 'spec');
const podContainersDef = podSpecDef.definedAttributes
  .find(({ name }) => name === 'containers');
const podContainerDef = podContainersDef.definedAttributes
  .find(({ name }) => name === null);
const podPortsDef = podContainerDef.definedAttributes
  .find(({ name }) => name === 'ports');
const podPortDef = podPortsDef.definedAttributes
  .find(({ name }) => name === null);

const pod = new Component({
  id: 'random',
  name: 'random',
  definition: podDef,
  path: null,
  attributes: [
    new ComponentAttribute({
      name: 'metadata',
      type: 'Object',
      definition: podMetadataDef,
      value: [
        new ComponentAttribute({
          name: 'labels',
          type: 'Object',
          definition: podMetadataDef.definedAttributes.find(({ name }) => name === 'labels'),
          value: [
            new ComponentAttribute({
              name: 'app',
              type: 'String',
              value: 'nginx',
            }),
          ],
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      definition: podSpecDef,
      value: [
        new ComponentAttribute({
          name: 'containers',
          type: 'Array',
          definition: podContainersDef,
          value: [
            new ComponentAttribute({
              name: '0',
              type: 'Object',
              definition: podContainerDef,
              value: [
                new ComponentAttribute({
                  name: 'name',
                  type: 'String',
                  definition: podContainerDef.definedAttributes.find(({ name }) => name === 'name'),
                  value: 'nginx',
                }),
                new ComponentAttribute({
                  name: 'image',
                  type: 'String',
                  definition: podContainerDef.definedAttributes.find(({ name }) => name === 'image'),
                  value: 'nginx:1.14.2',
                }),
                new ComponentAttribute({
                  name: 'ports',
                  type: 'Array',
                  definition: podPortsDef,
                  value: [
                    new ComponentAttribute({
                      name: '0',
                      type: 'Object',
                      definition: podPortDef,
                      value: [
                        new ComponentAttribute({
                          name: 'containerPort',
                          type: 'Number',
                          definition: podPortDef.definedAttributes.find(({ name }) => name === 'containerPort'),
                          value: 80,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

const deploymentDef = pluginData.definitions.components
  .find(({ type }) => type === 'Deployment');
const deploymentMetadataDef = deploymentDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const deploymentSpecDef = deploymentDef.definedAttributes
  .find(({ name }) => name === 'spec');
const deploymentSelectorDef = deploymentSpecDef.definedAttributes
  .find(({ name }) => name === 'selector');

const deployment = new Component({
  id: 'nginx-deployment',
  name: 'nginx-deployment',
  definition: deploymentDef,
  path: './deployment.yml',
  children: [pod],
  attributes: [
    new ComponentAttribute({
      name: 'metadata',
      type: 'Object',
      definition: deploymentMetadataDef,
      value: [
        new ComponentAttribute({
          name: 'labels',
          type: 'Object',
          definition: deploymentMetadataDef.definedAttributes.find(({ name }) => name === 'labels'),
          value: [
            new ComponentAttribute({
              name: 'app',
              type: 'String',
              value: 'nginx',
            }),
          ],
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      definition: deploymentSpecDef,
      value: [
        new ComponentAttribute({
          name: 'replicas',
          type: 'Number',
          definition: deploymentSpecDef.definedAttributes.find(({ name }) => name === 'replicas'),
          value: 3,
        }),
        new ComponentAttribute({
          name: 'selector',
          type: 'Object',
          definition: deploymentSelectorDef,
          value: [
            new ComponentAttribute({
              name: 'matchLabels',
              type: 'Object',
              definition: deploymentSelectorDef.definedAttributes.find(({ name }) => name === 'matchLabels'),
              value: [
                new ComponentAttribute({
                  name: 'app',
                  type: 'String',
                  value: 'nginx',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

export default deployment;
