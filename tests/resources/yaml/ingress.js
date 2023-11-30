import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();


const ingressDef = pluginData.definitions.components.find(({ type }) => type === 'Ingress');
const MetadataDef = ingressDef.definedAttributes.find(({ name }) => name === 'metadata');
const ingressSpecDef = ingressDef.definedAttributes.find(({ name }) => name === 'spec');


  const ingressComponent = new Component({
    id: 'test-ingress',
    path: './ingress.yaml',
    definition: ingressDef,
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
                value: 'test-ingress',
              }),
            ],
          }),  
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: ingressSpecDef,
        value: [
          new ComponentAttribute({
            name: 'rules',
            type: 'Array',
            definition: ingressSpecDef.definedAttributes.find(({ name }) => name === 'rules'),
            value: [
              new ComponentAttribute({
                name: "0",
                type: 'Object',
                definition: ingressSpecDef.definedAttributes.find(
                  ({ name }) => name === 'rules',
                ).definedAttributes.find(
                  ({ name }) => name ===  null,
                ),
                value: [
                  new ComponentAttribute({
                    name: 'host',
                    type: 'String',
                    definition: ingressSpecDef.definedAttributes.find(
                      ({ name }) => name === 'rules',
                    ).definedAttributes.find(
                      ({ name }) => name ===  null,
                    ).definedAttributes.find(
                      ({ name }) => name ===  'host',
                    ),
                    value: 'example.com',
                  }),
                  new ComponentAttribute({
                    name: 'http',
                    type: 'Object',
                    definition: ingressSpecDef.definedAttributes.find(
                      ({ name }) => name === 'rules',
                    ).definedAttributes.find(
                      ({ name }) => name ===  null,
                    ).definedAttributes.find(
                      ({ name }) => name ===  'http',
                    ),
                    value: [
                      new ComponentAttribute({
                        name: 'paths',
                        type: 'Array',
                        definition: ingressSpecDef.definedAttributes.find(
                          ({ name }) => name === 'rules',
                        ).definedAttributes.find(
                          ({ name }) => name ===  null,
                        ).definedAttributes.find(
                          ({ name }) => name ===  'http',
                        ).definedAttributes.find(
                          ({ name }) => name ===  'paths',
                        ),
                        value: [
                          new ComponentAttribute({
                            name: "0",
                            type: 'Object',
                            definition: ingressSpecDef.definedAttributes.find(
                              ({ name }) => name === 'rules',
                            ).definedAttributes.find(
                              ({ name }) => name ===  null,
                            ).definedAttributes.find(
                              ({ name }) => name ===  'http',
                            ).definedAttributes.find(
                              ({ name }) => name ===  'paths',
                            ).definedAttributes.find(
                              ({ name }) => name ===  null,
                            ),
                            value: [
                              new ComponentAttribute({
                                name: 'path',
                                type: 'String',
                                definition: ingressSpecDef.definedAttributes.find(
                                  ({ name }) => name === 'rules',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  null,
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'http',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'paths',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  null,
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'path',
                                ),
                                value: '/',
                              }),

                              new ComponentAttribute({
                                name: 'pathType',
                                type: 'String',
                                definition: ingressSpecDef.definedAttributes.find(
                                  ({ name }) => name === 'rules',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  null,
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'http',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'paths',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  null,
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'pathType',
                                ),
                                value: 'Prefix',
                              }),
                              
                              new ComponentAttribute({
                                name: 'backend',
                                type: 'Object',
                                definition: ingressSpecDef.definedAttributes.find(
                                  ({ name }) => name === 'rules',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  null,
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'http',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'paths',
                                ).definedAttributes.find(
                                  ({ name }) => name ===  null,
                                ).definedAttributes.find(
                                  ({ name }) => name ===  'backend',
                                ),
                                value: [
                                  new ComponentAttribute({
                                    name: 'service',
                                    type: 'Object',
                                    definition: ingressSpecDef.definedAttributes.find(
                                      ({ name }) => name === 'rules',
                                    ).definedAttributes.find(
                                      ({ name }) => name ===  null,
                                    ).definedAttributes.find(
                                      ({ name }) => name ===  'http',
                                    ).definedAttributes.find(
                                      ({ name }) => name ===  'paths',
                                    ).definedAttributes.find(
                                      ({ name }) => name ===  null,
                                    ).definedAttributes.find(
                                      ({ name }) => name ===  'backend',
                                    ).definedAttributes.find(
                                      ({ name }) => name ===  'service',
                                    ),
                                    value: [
                                      new ComponentAttribute({
                                        name: 'name',
                                        type: 'Link',
                                        definition: ingressSpecDef.definedAttributes.find(
                                          ({ name }) => name === 'rules',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  null,
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'http',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'paths',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  null,
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'backend',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'service',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'name',
                                        ),
                                        value: ['test-service'],
                                      }),
                                      new ComponentAttribute({
                                        name: 'port',
                                        type: 'Object',
                                        definition: ingressSpecDef.definedAttributes.find(
                                          ({ name }) => name === 'rules',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  null,
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'http',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'paths',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  null,
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'backend',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'service',
                                        ).definedAttributes.find(
                                          ({ name }) => name ===  'port',
                                        ),
                                        value: [
                                          new ComponentAttribute({
                                            name: 'number',
                                            type: 'Number',
                                            definition: ingressSpecDef.definedAttributes.find(
                                              ({ name }) => name === 'rules',
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  null,
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  'http',
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  'paths',
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  null,
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  'backend',
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  'service',
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  'port',
                                            ).definedAttributes.find(
                                              ({ name }) => name ===  'number',
                                            ),
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
  });


pluginData.components.push(ingressComponent);

export default pluginData;
