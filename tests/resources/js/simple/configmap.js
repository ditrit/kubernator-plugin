import {
  Component,
  ComponentAttribute,
} from '@ditrit/leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const configMapDef = pluginData.definitions.components
  .find(({ type }) => type === 'ConfigMap');
const metadataDef = configMapDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const labelsDef = metadataDef.definedAttributes
  .find(({ name }) => name === 'labels');

export default [
  new Component({
    id: 'test-configmap',
    path: 'configmap.yaml',
    definition: configMapDef,
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
                value: 'test-configmap',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'data',
        type: 'Object',
        definition: configMapDef.definedAttributes.find(({ name }) => name === 'data'),
        value: [
          new ComponentAttribute({
            name: 'config.properties',
            type: 'String',
            value: 'key1=value1\nkey2=value2',
          }),
        ],
      }),
    ],
  }),
];
