import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const serviceDef = pluginData.definitions.components
  .find(({ type }) => type === 'Service');
const specDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'spec');

export default [
  new Component({
    id: 'nginx',
    path: 'wrong_link_selector.yaml',
    definition: serviceDef,
    attributes: [
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: specDef,
        value: [
          new ComponentAttribute({
            name: 'selector',
            type: 'Array',
            definition: specDef.definedAttributes.find(({ name }) => name === 'selector'),
            value: ['this_is_a_wrong_id'],
          }),
        ],
      }),
    ],
  }),
];
