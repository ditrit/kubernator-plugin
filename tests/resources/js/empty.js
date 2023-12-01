import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const podDef = pluginData.definitions.components.find(({ type }) => type === 'Pod');

const podComponent = new Component({
  id: 'empty-pod',
  path: './empty.yaml',
  definition: podDef,
  attributes: [
    new ComponentAttribute({
      name: 'version',
      type: 'String',
      definition: podDef.definedAttributes
        .find(({ name }) => name === 'version'),
      value: '3.9',
    }),
  ],
});

pluginData.components.push(podComponent);

export default pluginData;
