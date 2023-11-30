import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';


const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const jobDef = pluginData.definitions.components.find(({ type }) => type === 'Job');
const MetadataDef = jobDef.definedAttributes.find(({ name }) => name === 'metadata');
const jobSpecDef = jobDef.definedAttributes.find(({ name }) => name === 'spec');

const jobComponent = new Component({
  id: 'job-test',
  path: './job.yaml',
  definition: jobDef,
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
              name: 'app.kubernetes.io/name',
              type: 'String',
              definition: MetadataDef.definedAttributes.find(
                ({ name }) => name === 'labels',
              ).definedAttributes.find(
                ({ name }) => name === 'app.kubernetes.io/name',
              ),
              value: 'job-test',
            }),
          ],
        }),  
      ],
    }),
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      definition: jobSpecDef,
      value: [],
    }),
  ],
});

pluginData.components.push(jobComponent);

export default pluginData;
