import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const secretDef = pluginData.definitions.components.find(({ type }) => type === 'Secret');
const MetadataDef = secretDef.definedAttributes.find(({ name }) => name === 'metadata');
const secretDataDef = secretDef.definedAttributes.find(({ name }) => name === 'data');

const secretComponent = new Component({
  id: 'test-secret',
  path: './secret.yaml',
  definition: secretDef,
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
              value: 'test-secret',
            }),
          ],
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'type',
      type: 'String',
      definition: secretDef.definedAttributes.find(({ name }) => name === 'type'),
      value: 'Opaque',
    }),
    new ComponentAttribute({
      name: 'data',
      type: 'Object',
      definition: secretDataDef,
      value: [
        new ComponentAttribute({
          name: 'username',
          type: 'String',
          value: 'dXNlcm5hbWU=',
        }),
        new ComponentAttribute({
          name: 'password',
          type: 'String',
          value: 'cGFzc3dvcmQ=',
        }),
      ],
    }),
  ],
});

pluginData.components.push(secretComponent);

export default pluginData;

