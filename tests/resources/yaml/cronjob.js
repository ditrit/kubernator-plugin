import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();
const JobDef = pluginData.definitions.components.find(({ type }) => type === 'Job');
const MetadataDef = JobDef.definedAttributes.find(({ name }) => name === 'metadata');
const JobSpecDef = JobDef.definedAttributes.find(({ name }) => name === 'parent');
const cronJobDef = pluginData.definitions.components.find(({ type }) => type === 'CronJob');
const cronJobMetadataDef = cronJobDef.definedAttributes.find(({ name }) => name === 'metadata');
const cronJobSpecDef = cronJobDef.definedAttributes.find(({ name }) => name === 'spec');



const jobComponent = new Component({
  id: 'job-test',
  path: null,
  definition: JobDef,
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
      name: 'parent',
      type: 'String',
      definition: JobSpecDef,
      value : 'cron-job',
    }),
  ],
});
const cronjobComponent = new Component({
  id: 'cron-job',
  path: './cronjob.yaml',
  definition: cronJobDef,
  attributes: [
    new ComponentAttribute({
      name: 'metadata',
      type: 'Object',
      definition: cronJobMetadataDef,
      value: [
        new ComponentAttribute({
          name: 'labels',
          type: 'Object',
          definition: cronJobMetadataDef.definedAttributes.find(({ name }) => name === 'labels'), 
          value: [
            new ComponentAttribute({
              name: 'app.kubernetes.io/name',
              type: 'String',
              definition: cronJobMetadataDef.definedAttributes.find(
                ({ name }) => name === 'labels',
              ).definedAttributes.find(
                ({ name }) => name === 'app.kubernetes.io/name',
              ),
              value: 'cron-job',
            }),
          ],
        }),  
      ],
    }),
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      containerRef: 'CronJob',
      definition: cronJobSpecDef,
      value: [],
    }),  
  ],
});
pluginData.components.push(jobComponent);
pluginData.components.push(cronjobComponent);
export default pluginData;
