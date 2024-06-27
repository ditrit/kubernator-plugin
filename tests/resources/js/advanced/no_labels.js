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

export default [
  new Component({
    id: 'pod',
    path: 'no_labels.yaml',
    definition: podDef,
    attributes: [
      new ComponentAttribute({
        name: 'metadata',
        type: 'Object',
        definition: podDef.definedAttributes.find(({ name }) => name === 'metadata'),
        value: [],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: podDef.definedAttributes.find(({ name }) => name === 'spec'),
        value: [],
      }),
    ],
  }),
];
