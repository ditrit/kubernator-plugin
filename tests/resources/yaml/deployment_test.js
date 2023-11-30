import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
import KubernetesData from '../../../src/models/KubernetesData';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const secretmountDef = pluginData.definitions.components.find(({ type }) => type === 'SecretMount');

const pvcmountDef = pluginData.definitions.components.find(({ type }) => type === 'PersistentVolumeClaimMount');


const cmmountDef = pluginData.definitions.components.find(({ type }) => type === 'ConfigMapMount');

const containerDef = pluginData.definitions.components.find(({ type }) => type === 'Container');

const podDef = pluginData.definitions.components.find(({ type }) => type === 'Pod');
const podMetadataDef = podDef.definedAttributes.find(({ name }) => name === 'metadata');
const parentDeploymentDef = podDef.definedAttributes.find(({ name }) => name === 'parentDeployment');
const podSpecDef = podDef.definedAttributes.find(({ name }) => name === 'spec');

const deploymentDef = pluginData.definitions.components.find(({ type }) => type === 'Deployment');
const MetadataDef = deploymentDef.definedAttributes.find(({ name }) => name === 'metadata');
const deploymentSpecDef = deploymentDef.definedAttributes.find(({ name }) => name === 'spec');



const cmmountComponent = new Component({
  id: 'config-map-mount',
  path: null,
  definition: cmmountDef,
  attributes: [
    new ComponentAttribute({
      name: 'mountPath',
      type: 'String',
      definition: cmmountDef.definedAttributes.find(({ name }) => name === 'mountPath'), 
      value : '/mnt',
    }),

    new ComponentAttribute({
      name: 'configMap',
      type: 'Object',
      definition: cmmountDef.definedAttributes.find(({ name }) => name === 'configMap'), 
      value : [
        new ComponentAttribute({
          name: 'name',
          type: 'Link',
          path: null,
          definition: cmmountDef.definedAttributes.find(
            ({ name }) => name === 'configMap',
          ).definedAttributes.find(
            ({ name }) => name === 'name',
          ),  
          value :[ "test-configmap" ],
        }),

      ],
    }),
    
    new ComponentAttribute({
      name: 'parent',
      type: 'String',
      definition: cmmountDef.definedAttributes.find(({ name }) => name === 'parent'), 
      value : 'nginx-container',
    }),
    
  ],
});


const secretmountComponent = new Component({
  id: 'secret-mount',
  path: null,
  definition: secretmountDef,
  attributes: [
    new ComponentAttribute({
      name: 'mountPath',
      type: 'String',
      definition: secretmountDef.definedAttributes.find(({ name }) => name === 'mountPath'), 
      value : '/mnt/secret',
    }),

    new ComponentAttribute({
      name: 'secret',
      type: 'Object',
      definition: secretmountDef.definedAttributes.find(({ name }) => name === 'secret'), 
      value : [
        new ComponentAttribute({
          name: 'secretName',
          type: 'Link',
          path: null,
          definition: secretmountDef.definedAttributes.find(
            ({ name }) => name === 'secret',
          ).definedAttributes.find(
            ({ name }) => name === 'secretName',
          ),  
          value :[ "test-secret" ],
        }),

      ],
    }),
    
    new ComponentAttribute({
      name: 'parent',
      type: 'String',
      definition: secretmountDef.definedAttributes.find(({ name }) => name === 'parent'), 
      value : 'nginx-container',
    }),
    
  ],
});

const pvcmountComponent = new Component({
  id: 'pvc-mount',
  path: null,
  definition: pvcmountDef,
  attributes: [
    new ComponentAttribute({
      name: 'mountPath',
      type: 'String',
      definition: pvcmountDef.definedAttributes.find(({ name }) => name === 'mountPath'), 
      value : '/mnt/pvc',
    }),

    new ComponentAttribute({
      name: 'persistentVolumeClaim',
      type: 'Object',
      definition: pvcmountDef.definedAttributes.find(({ name }) => name === 'persistentVolumeClaim'), 
      value : [
        new ComponentAttribute({
          name: 'claimName',
          type: 'Link',
          path: null,
          definition: pvcmountDef.definedAttributes.find(
            ({ name }) => name === 'persistentVolumeClaim',
          ).definedAttributes.find(
            ({ name }) => name === 'claimName',
          ),  
          value :[ "task-pv-volume" ],
        }),

      ],
    }),
    
    new ComponentAttribute({
      name: 'parent',
      type: 'String',
      definition: pvcmountDef.definedAttributes.find(({ name }) => name === 'parent'), 
      value : 'nginx-container',
    }),
    
  ],
});



const containerComponent = new Component({
  id: 'nginx-container',
  path: null,
  definition: containerDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: containerDef.definedAttributes.find(({ name }) => name === 'image'), 
      value : 'nginx:1.4.0',
    }),
    new ComponentAttribute({
      name: 'isInitContainer',
      type: 'Boolean',
      definition: containerDef.definedAttributes.find(({ name }) => name === 'isInitContainer'), 
      value : false,
    }),

    
    new ComponentAttribute({
      name: 'parent',
      type: 'String',
      definition: containerDef.definedAttributes.find(({ name }) => name === 'parent'), 
      value : 'pod',
    }),
    
  ],
});

const podComponent = new Component({
  id: 'pod',
  path: null,
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
          definition: podMetadataDef.definedAttributes.find(({ name }) => name === 'labels'), 
          value: [
            new ComponentAttribute({
              name: 'app.kubernetes.io/name',
              type: 'String',
              definition: podMetadataDef.definedAttributes.find(
                ({ name }) => name === 'labels',
              ).definedAttributes.find(
                ({ name }) => name === 'app.kubernetes.io/name',
              ),
              value: 'pod',
            }),
          ],
        }),  
      ],
    }),
    
    new ComponentAttribute({
      name: 'spec',
      type: 'Object',
      containerRef: null,
      definition: podSpecDef,
      value: [],
    }),
    new ComponentAttribute({
      name: 'parentDeployment',
      type: 'String',
      definition: parentDeploymentDef,
      value : 'nginx',
    }),
  ],
});


const deploymentComponent = new Component({
    id: 'nginx',
    path: './deployment_test.yaml',
    definition: deploymentDef,
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
      containerRef: null,
      definition: deploymentSpecDef,
      value: [],
    }),  
    ],
});

pluginData.components.push(cmmountComponent);
pluginData.components.push(pvcmountComponent);
pluginData.components.push(secretmountComponent);
pluginData.components.push(containerComponent);
pluginData.components.push(podComponent);
pluginData.components.push(deploymentComponent);


export default pluginData;
