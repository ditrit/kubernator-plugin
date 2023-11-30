import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';


const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const podDef = pluginData.definitions.components.find(({ type }) => type === 'Pod');
const MetadataDef = podDef.definedAttributes.find(({ name }) => name === 'metadata');
const podSpecDef = podDef.definedAttributes.find(({ name }) => name === 'spec');

const podComponent = new Component({
  id: 'pod',
  path: './pod.yaml',
  definition: podDef,
  attributes: [
    new ComponentAttribute({
      name: 'metadata',
      type: 'Object',
      definition: MetadataDef,
      value: [
        new ComponentAttribute({
          name: 'labels',
          type: 'Object',
          definition: MetadataDef.definedAttributes.find(({ name }) => name === 'labels'), 
          value: [
            new ComponentAttribute({
              name: 'name',
              type: 'String',
              definition: MetadataDef.definedAttributes.find(
                ({ name }) => name === 'labels',
              ).definedAttributes.find(
                ({ name }) => name === 'name',
              ),
              value: 'mon-application',
            }),
          ],
        }),  
      ],
    }),
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      definition: podSpecDef,
      value: [],
    }),
  ],
});

pluginData.components.push(podComponent);

export default pluginData;
