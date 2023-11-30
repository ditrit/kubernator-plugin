import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';


const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const pvcDef = pluginData.definitions.components.find(({ type }) => type === 'PersistentVolumeClaim');
const MetadataDef = pvcDef.definedAttributes.find(({ name }) => name === 'metadata');
const pvcSpecDef = pvcDef.definedAttributes.find(({ name }) => name === 'spec');

const pvcComponent = new Component({
  id: 'task-pv-volume',
  path: './pvc.yaml',
  definition: pvcDef,
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
          definition: pvcSpecDef.definedAttributes.find(
            ({ name }) => name === 'storageClassName',
          ),
          value: "manual",
          }),
        new ComponentAttribute({
          name: 'accessModes',
          type: 'Array',
          definition: pvcSpecDef.definedAttributes.find(
            ({ name }) => name === 'accessModes',
          ),
          value: [
            new ComponentAttribute({
                name: '0',
                type: 'String',
                definition: pvcSpecDef.definedAttributes.find(
                  ({ name }) => name === 'accessModes',
                ).definedAttributes.find(
                  ({ name }) => name === null,
                ),
                value:"ReadWriteOnce",
            }),

          ],
        }),
        new ComponentAttribute({
          name: 'selector',
          type: 'Object',
          definition: pvcSpecDef.definedAttributes.find(
            ({ name }) => name === 'selector',
          ),
          value: [
            new ComponentAttribute({
                name: 'matchLabels',
                type: 'Object',
                definition: pvcSpecDef.definedAttributes.find(
                  ({ name }) => name === 'selector',
                ).definedAttributes.find(
                  ({ name }) => name === 'matchLabels',
                ),
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
});

pluginData.components.push(pvcComponent);

export default pluginData;
