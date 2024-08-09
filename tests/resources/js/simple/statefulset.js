import {
  Component,
  ComponentAttribute,
} from '@ditrit/leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const statefulSetDef = pluginData.definitions.components
  .find(({ type }) => type === 'StatefulSet');
const metadataDef = statefulSetDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const labelsDef = metadataDef.definedAttributes
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
    id: 'stateful-set',
    path: 'statefulset.yaml',
    definition: statefulSetDef,
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
                name: 'app.kubernetes.io/name',
                type: 'String',
                definition: labelsDef.definedAttributes.find(({ name }) => name === 'app.kubernetes.io/name'),
                value: 'stateful-set',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: statefulSetDef.definedAttributes.find(({ name }) => name === 'spec'),
        value: [],
      }),
    ],
  }),

  new Component({
    id: 'pod-in-statefulset',
    path: 'statefulset.yaml',
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
                value: 'pod-in-statefulset',
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
        name: 'parentStatefulSet',
        type: 'String',
        definition: podDef.definedAttributes.find(({ name }) => name === 'parentStatefulSet'),
        value: 'stateful-set',
      }),
    ],
  }),

  new Component({
    id: 'container-in-statefulset',
    path: 'statefulset.yaml',
    definition: containerDef,
    attributes: [
      new ComponentAttribute({
        name: 'parent',
        type: 'String',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'parent'),
        value: 'pod-in-statefulset',
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
