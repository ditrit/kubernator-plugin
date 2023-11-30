import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';


const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const serviceDef = pluginData.definitions.components.find(({ type }) => type === 'Service');
const MetadataDef = serviceDef.definedAttributes.find(({ name }) => name === 'metadata');
const serviceSpecDef = serviceDef.definedAttributes.find(({ name }) => name === 'spec');

const serviceComponent = new Component({
  id: 'nginx',
  path: './service.yaml',
  definition: serviceDef,
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
              value: 'nginx',
            }),
          ],
        }),  
      ],
    }),
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      definition: serviceSpecDef,
      value: [
        new ComponentAttribute({
          name: 'selector',
          type: 'Link',
          definition: serviceSpecDef.definedAttributes.find(
            ({ name }) => name === 'selector',
          ),
          value: [],
          }),
        new ComponentAttribute({
          name: 'type',
          type: 'String',
          definition: serviceSpecDef.definedAttributes.find(
            ({ name }) => name === 'type',
          ),
          value: 'NodePort',
        }),
        new ComponentAttribute({
          name: 'ports',
          type: 'Array',
          definition: serviceSpecDef.definedAttributes.find(
            ({ name }) => name === 'ports',
          ),
          value: [
            new ComponentAttribute({
              name: '0',
              type: 'Object',
              definition: serviceSpecDef.definedAttributes.find(
                ({ name }) => name === 'ports',
              ).definedAttributes.find(
                ({ name }) => name === null,
              ),
              value: [
                new ComponentAttribute({
                  name: 'protocol',
                  type: 'String',
                  definition: serviceSpecDef.definedAttributes.find(
                    ({ name }) => name === 'ports',
                  ).definedAttributes.find(
                    ({ name }) => name ===  null,
                  ).definedAttributes.find(
                    ({ name }) => name ===  'protocol',
                  ),
                  value: 'TCP',
                }),
                new ComponentAttribute({
                  name: 'port',
                  type: 'Number',
                  definition: serviceSpecDef.definedAttributes.find(
                    ({ name }) => name === 'ports',
                  ).definedAttributes.find(
                    ({ name }) => name ===  null,
                  ).definedAttributes.find(
                    ({ name }) => name ===  'port',
                  ),
                  value: 80,
                }),
                new ComponentAttribute({
                  name: 'targetPort',
                  type: 'String',
                  definition: serviceSpecDef.definedAttributes.find(
                    ({ name }) => name === 'ports',
                  ).definedAttributes.find(
                    ({ name }) => name ===  null,
                  ).definedAttributes.find(
                    ({ name }) => name ===  'targetPort',
                  ),
                  value: '80',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});

pluginData.components.push(serviceComponent);

export default pluginData;
