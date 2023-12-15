import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const serviceDef = pluginData.definitions.components
  .find(({ type }) => type === 'Service');
const metadataDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const labelsDef = metadataDef.definedAttributes
  .find(({ name }) => name === 'labels');
const specDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'spec');
const portsDef = specDef.definedAttributes
  .find(({ name }) => name === 'ports');
const portDef = portsDef.definedAttributes[0];

export default [
  new Component({
    id: 'nginx',
    path: 'service.yaml',
    definition: serviceDef,
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
                value: 'nginx',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: specDef,
        value: [
          new ComponentAttribute({
            name: 'selector',
            type: 'Array',
            definition: specDef.definedAttributes.find(({ name }) => name === 'selector'),
            value: ['pod'],
          }),
          new ComponentAttribute({
            name: 'type',
            type: 'String',
            definition: specDef.definedAttributes.find(({ name }) => name === 'type'),
            value: 'NodePort',
          }),
          new ComponentAttribute({
            name: 'ports',
            type: 'Array',
            definition: portsDef,
            value: [
              new ComponentAttribute({
                name: null,
                type: 'Object',
                definition: portDef,
                value: [
                  new ComponentAttribute({
                    name: 'protocol',
                    type: 'String',
                    definition: portDef.definedAttributes.find(({ name }) => name === 'protocol'),
                    value: 'TCP',
                  }),
                  new ComponentAttribute({
                    name: 'port',
                    type: 'Number',
                    definition: portDef.definedAttributes.find(({ name }) => name === 'port'),
                    value: 80,
                  }),
                  new ComponentAttribute({
                    name: 'targetPort',
                    type: 'String',
                    definition: portDef.definedAttributes.find(({ name }) => name === 'targetPort'),
                    value: '80',
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
