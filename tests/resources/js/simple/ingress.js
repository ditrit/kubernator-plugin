import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const ingressDef = pluginData.definitions.components
  .find(({ type }) => type === 'Ingress');
const metadataDef = ingressDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const labelsDef = metadataDef.definedAttributes
  .find(({ name }) => name === 'labels');
const specDef = ingressDef.definedAttributes
  .find(({ name }) => name === 'spec');
const rulesDef = specDef.definedAttributes
  .find(({ name }) => name === 'rules');
const ruleDef = rulesDef.definedAttributes[0];
const httpDef = ruleDef.definedAttributes
  .find(({ name }) => name === 'http');
const pathsDef = httpDef.definedAttributes
  .find(({ name }) => name === 'paths');
const pathDef = pathsDef.definedAttributes[0];
const backendDef = pathDef.definedAttributes
  .find(({ name }) => name === 'backend');
const serviceDef = backendDef.definedAttributes
  .find(({ name }) => name === 'service');
const portDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'port');

export default [
  new Component({
    id: 'test-ingress',
    path: 'ingress.yaml',
    definition: ingressDef,
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
                value: 'test-ingress',
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
            name: 'rules',
            type: 'Array',
            definition: rulesDef,
            value: [
              new ComponentAttribute({
                name: null,
                type: 'Object',
                definition: ruleDef,
                value: [
                  new ComponentAttribute({
                    name: 'host',
                    type: 'String',
                    definition: ruleDef.definedAttributes.find(({ name }) => name === 'host'),
                    value: 'example.com',
                  }),
                  new ComponentAttribute({
                    name: 'http',
                    type: 'Object',
                    definition: httpDef,
                    value: [
                      new ComponentAttribute({
                        name: 'paths',
                        type: 'Array',
                        definition: pathsDef,
                        value: [
                          new ComponentAttribute({
                            name: null,
                            type: 'Object',
                            definition: pathDef,
                            value: [
                              new ComponentAttribute({
                                name: 'path',
                                type: 'String',
                                definition: pathDef.definedAttributes.find(({ name }) => name === 'path'),
                                value: '/',
                              }),
                              new ComponentAttribute({
                                name: 'pathType',
                                type: 'String',
                                definition: pathDef.definedAttributes.find(({ name }) => name === 'pathType'),
                                value: 'Prefix',
                              }),
                              new ComponentAttribute({
                                name: 'backend',
                                type: 'Object',
                                definition: backendDef,
                                value: [
                                  new ComponentAttribute({
                                    name: 'service',
                                    type: 'Object',
                                    definition: serviceDef,
                                    value: [
                                      new ComponentAttribute({
                                        name: 'name',
                                        type: 'Array',
                                        definition: serviceDef.definedAttributes.find(({ name }) => name === 'name'),
                                        value: ['test-service'],
                                      }),
                                      new ComponentAttribute({
                                        name: 'port',
                                        type: 'Object',
                                        definition: portDef,
                                        value: [
                                          new ComponentAttribute({
                                            name: 'number',
                                            type: 'Number',
                                            definition: portDef.definedAttributes.find(({ name }) => name === 'number'),
                                            value: 80,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
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
