import { Component } from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const deploymentDef = pluginData.definitions.components
  .find(({ type }) => type === 'Deployment');

export default [
  new Component({
    id: 'nginx',
    path: 'no_specs.yaml',
    definition: deploymentDef,
    attributes: [],
  }),
];
