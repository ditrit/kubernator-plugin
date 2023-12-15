import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const podDef = pluginData.definitions.components
  .find(({ type }) => type === 'Pod');
const metadataDef = podDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const labelsDef = metadataDef.definedAttributes
  .find(({ name }) => name === 'labels');

const containerDef = pluginData.definitions.components
  .find(({ type }) => type === 'Container');

export default [
  new Component({
    id: 'pod',
    path: 'pod.yaml',
    definition: podDef,
    attributes: [
      new ComponentAttribute({
        name: 'metadata',
        type: 'Object',
        definition: metadataDef,
        value: [
          new ComponentAttribute({
            name: 'labels',
            type: 'Object',
            definition: labelsDef,
            value: [
              new ComponentAttribute({
                name: 'name',
                type: 'String',
                definition: labelsDef.definedAttributes.find(({ name }) => name === 'name'),
                value: 'mon-application',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: podDef.definedAttributes.find(({ name }) => name === 'spec'),
        value: [],
      }),
    ],
  }),

  new Component({
    id: 'initcontainer-in-pod',
    path: 'pod.yaml',
    definition: containerDef,
    attributes: [
      new ComponentAttribute({
        name: 'parent',
        type: 'String',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'parent'),
        value: 'pod',
      }),
      new ComponentAttribute({
        name: 'isInitContainer',
        type: 'Boolean',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'isInitContainer'),
        value: true,
      }),
    ],
  }),
];
