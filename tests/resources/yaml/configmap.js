import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();


const configMapDef = pluginData.definitions.components.find(({ type }) => type === 'ConfigMap');
const MetadataDef = configMapDef.definedAttributes.find(({ name }) => name === 'metadata');
const configMapDataDef = configMapDef.definedAttributes.find(({ name }) => name === 'data');


const configmapComponent = new Component({
  id: 'test-configmap',
  path: './configmap.yaml',
  definition: configMapDef,
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
              value: 'test-configmap',
            }),
          ],
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'data',
      type: 'Object',
      definition: configMapDataDef,
      value: [
        new ComponentAttribute({
          name: 'config.properties',
          type: 'String',
          value: 'key1=value1\nkey2=value2',
        }),
      ],
    }),
  ],
});
pluginData.components.push(configmapComponent);
export default pluginData;
