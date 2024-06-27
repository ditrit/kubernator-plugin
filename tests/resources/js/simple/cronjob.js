import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const cronJobDef = pluginData.definitions.components
  .find(({ type }) => type === 'CronJob');
const cronJobMetadataDef = cronJobDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const cronJobLabelsDef = cronJobMetadataDef.definedAttributes
  .find(({ name }) => name === 'labels');

const jobDef = pluginData.definitions.components
  .find(({ type }) => type === 'Job');
const jobMetadataDef = jobDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const jobLabelsDef = jobMetadataDef.definedAttributes
  .find(({ name }) => name === 'labels');

const podDef = pluginData.definitions.components
  .find(({ type }) => type === 'Pod');
const podMetadataDef = podDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const podLabelsDef = podMetadataDef.definedAttributes
  .find(({ name }) => name === 'labels');

const containerDef = pluginData.definitions.components
  .find(({ type }) => type === 'Container');

export default [
  new Component({
    id: 'cron-job',
    path: 'cronjob.yaml',
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
            definition: cronJobLabelsDef,
            value: [
              new ComponentAttribute({
                name: 'app.kubernetes.io/name',
                type: 'String',
                definition: cronJobLabelsDef.definedAttributes.find(({ name }) => name === 'app.kubernetes.io/name'),
                value: 'cron-job',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: cronJobDef.definedAttributes.find(({ name }) => name === 'spec'),
        value: [],
      }),
    ],
  }),

  new Component({
    id: 'job-in-cronjob',
    path: 'cronjob.yaml',
    definition: jobDef,
    attributes: [
      new ComponentAttribute({
        name: 'metadata',
        type: 'Object',
        definition: jobMetadataDef,
        value: [
          new ComponentAttribute({
            name: 'labels',
            type: 'Object',
            definition: jobLabelsDef,
            value: [
              new ComponentAttribute({
                name: 'app.kubernetes.io/name',
                type: 'String',
                definition: jobLabelsDef.definedAttributes.find(({ name }) => name === 'app.kubernetes.io/name'),
                value: 'job-in-cronjob',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: jobDef.definedAttributes.find(({ name }) => name === 'spec'),
        value: [],
      }),
      new ComponentAttribute({
        name: 'parent',
        type: 'String',
        definition: jobDef.definedAttributes.find(({ name }) => name === 'parent'),
        value: 'cron-job',
      }),
    ],
  }),

  new Component({
    id: 'pod-in-cronjob',
    path: 'cronjob.yaml',
    definition: podDef,
    attributes: [
      new ComponentAttribute({
        name: 'metadata',
        type: 'Object',
        definition: podMetadataDef,
        value: [
          new ComponentAttribute({
            name: 'labels',
            type: 'Object',
            definition: podLabelsDef,
            value: [
              new ComponentAttribute({
                name: 'app.kubernetes.io/name',
                type: 'String',
                definition: podLabelsDef.definedAttributes.find(({ name }) => name === 'app.kubernetes.io/name'),
                value: 'pod-in-cronjob',
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
      new ComponentAttribute({
        name: 'parentJob',
        type: 'String',
        definition: podDef.definedAttributes.find(({ name }) => name === 'parentJob'),
        value: 'job-in-cronjob',
      }),
    ],
  }),

  new Component({
    id: 'container-in-cronjob',
    path: 'cronjob.yaml',
    definition: containerDef,
    attributes: [
      new ComponentAttribute({
        name: 'parent',
        type: 'String',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'parent'),
        value: 'pod-in-cronjob',
      }),
      new ComponentAttribute({
        name: 'isInitContainer',
        type: 'Boolean',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'isInitContainer'),
        value: false,
      }),
    ],
  }),
];
