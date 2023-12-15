import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const pvcDef = pluginData.definitions.components
  .find(({ type }) => type === 'PersistentVolumeClaim');
const metadataDef = pvcDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const labelsDef = metadataDef.definedAttributes
  .find(({ name }) => name === 'labels');
const pvcSpecDef = pvcDef.definedAttributes
  .find(({ name }) => name === 'spec');
const selectorDef = pvcSpecDef.definedAttributes
  .find(({ name }) => name === 'selector');

export default [
  new Component({
    id: 'task-pv-volume',
    path: 'pvc.yaml',
    definition: pvcDef,
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
                value: 'task-pv-volume',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: pvcSpecDef,
        value: [
          new ComponentAttribute({
            name: 'storageClassName',
            type: 'String',
            definition: pvcSpecDef.definedAttributes.find(({ name }) => name === 'storageClassName'),
            value: 'manual',
          }),
          new ComponentAttribute({
            name: 'accessModes',
            type: 'Array',
            definition: pvcSpecDef.definedAttributes.find(({ name }) => name === 'accessModes'),
            value: ['ReadWriteOnce'],
          }),
          new ComponentAttribute({
            name: 'selector',
            type: 'Object',
            definition: selectorDef,
            value: [
              new ComponentAttribute({
                name: 'matchLabels',
                type: 'Object',
                definition: selectorDef.definedAttributes.find(({ name }) => name === 'matchLabels'),
                value: [
                  new ComponentAttribute({
                    name: 'release',
                    type: 'String',
                    value: 'stable',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
];
