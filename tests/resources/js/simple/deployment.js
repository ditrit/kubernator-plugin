import {
  Component,
  ComponentAttribute,
} from '@ditrit/leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';

const pluginData = new KubernetesData();
const metadata = new KubernetesMetadata(pluginData);
metadata.parse();

const deploymentDef = pluginData.definitions.components
  .find(({ type }) => type === 'Deployment');
const deploymentMetadataDef = deploymentDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const deploymentLabelsDef = deploymentMetadataDef.definedAttributes
  .find(({ name }) => name === 'labels');

const podDef = pluginData.definitions.components
  .find(({ type }) => type === 'Pod');
const podMetadataDef = podDef.definedAttributes
  .find(({ name }) => name === 'metadata');
const podLabelsDef = podMetadataDef.definedAttributes
  .find(({ name }) => name === 'labels');
const podSpecDef = podDef.definedAttributes
  .find(({ name }) => name === 'spec');
const podVolumesDef = podSpecDef.definedAttributes
  .find(({ name }) => name === 'volumes');
const podVolumeDef = podVolumesDef.definedAttributes[0];
const podVolumeConfigMapDef = podVolumeDef.definedAttributes
  .find(({ name }) => name === 'configMap');
const podVolumeSecretDef = podVolumeDef.definedAttributes
  .find(({ name }) => name === 'secret');
const podVolumePersistentVolumeClaimDef = podVolumeDef.definedAttributes
  .find(({ name }) => name === 'persistentVolumeClaim');

const containerDef = pluginData.definitions.components
  .find(({ type }) => type === 'Container');
const containerVolumeMountsDef = containerDef.definedAttributes
  .find(({ name }) => name === 'volumeMounts');
const containerVolumeMountDef = containerVolumeMountsDef.definedAttributes[0];

export default [
  new Component({
    id: 'nginx',
    path: 'deployment.yaml',
    definition: deploymentDef,
    attributes: [
      new ComponentAttribute({
        name: 'metadata',
        type: 'Object',
        definition: deploymentMetadataDef,
        value: [
          new ComponentAttribute({
            name: 'labels',
            type: 'Object',
            definition: deploymentLabelsDef,
            value: [
              new ComponentAttribute({
                name: 'app.kubernetes.io/name',
                type: 'String',
                definition: deploymentLabelsDef.definedAttributes.find(({ name }) => name === 'app.kubernetes.io/name'),
                value: 'nginx',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: deploymentDef.definedAttributes.find(({ name }) => name === 'spec'),
        value: [],
      }),
    ],
  }),

  new Component({
    id: 'pod-in-deployment',
    path: 'deployment.yaml',
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
            definition: podLabelsDef,
            value: [
              new ComponentAttribute({
                name: 'app.kubernetes.io/name',
                type: 'String',
                definition: podLabelsDef.definedAttributes.find(({ name }) => name === 'app.kubernetes.io/name'),
                value: 'pod-in-deployment',
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'spec',
        type: 'Object',
        definition: podSpecDef,
        value: [
          new ComponentAttribute({
            name: 'volumes',
            type: 'Array',
            definition: podVolumesDef,
            value: [
              new ComponentAttribute({
                name: null,
                type: 'Object',
                definition: podVolumeDef,
                value: [
                  new ComponentAttribute({
                    name: 'name',
                    type: 'String',
                    definition: podVolumeDef.definedAttributes.find(({ name }) => name === 'name'),
                    value: 'config-map-mount',
                  }),
                  new ComponentAttribute({
                    name: 'configMap',
                    type: 'Object',
                    definition: podVolumeConfigMapDef,
                    value: [
                      new ComponentAttribute({
                        name: 'name',
                        type: 'Array',
                        definition: podVolumeConfigMapDef.definedAttributes.find(({ name }) => name === 'name'),
                        value: ['test-configmap'],
                      }),
                    ],
                  }),
                ],
              }),
              new ComponentAttribute({
                name: null,
                type: 'Object',
                definition: podVolumeDef,
                value: [
                  new ComponentAttribute({
                    name: 'name',
                    type: 'String',
                    definition: podVolumeDef.definedAttributes.find(({ name }) => name === 'name'),
                    value: 'secret-mount',
                  }),
                  new ComponentAttribute({
                    name: 'secret',
                    type: 'Object',
                    definition: podVolumeSecretDef,
                    value: [
                      new ComponentAttribute({
                        name: 'secretName',
                        type: 'Array',
                        definition: podVolumeSecretDef.definedAttributes.find(({ name }) => name === 'secretName'),
                        value: ['test-secret'],
                      }),
                    ],
                  }),
                ],
              }),
              new ComponentAttribute({
                name: null,
                type: 'Object',
                definition: podVolumeDef,
                value: [
                  new ComponentAttribute({
                    name: 'name',
                    type: 'String',
                    definition: podVolumeDef.definedAttributes.find(({ name }) => name === 'name'),
                    value: 'pvc-mount',
                  }),
                  new ComponentAttribute({
                    name: 'persistentVolumeClaim',
                    type: 'Object',
                    definition: podVolumePersistentVolumeClaimDef,
                    value: [
                      new ComponentAttribute({
                        name: 'claimName',
                        type: 'Array',
                        definition: podVolumePersistentVolumeClaimDef.definedAttributes.find(({ name }) => name === 'claimName'),
                        value: ['task-pv-volume'],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'parentDeployment',
        type: 'String',
        definition: podDef.definedAttributes.find(({ name }) => name === 'parentDeployment'),
        value: 'nginx',
      }),
    ],
  }),

  new Component({
    id: 'container-in-deployment',
    path: 'deployment.yaml',
    definition: containerDef,
    attributes: [
      new ComponentAttribute({
        name: 'image',
        type: 'String',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'image'),
        value: 'nginx:1.4.0',
      }),
      new ComponentAttribute({
        name: 'volumeMounts',
        type: 'Array',
        definition: containerVolumeMountsDef,
        value: [
          new ComponentAttribute({
            name: null,
            type: 'Object',
            definition: containerVolumeMountDef,
            value: [
              new ComponentAttribute({
                name: 'name',
                type: 'String',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'name'),
                value: 'config-map-mount',
              }),
              new ComponentAttribute({
                name: 'mountPath',
                type: 'String',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'mountPath'),
                value: '/mnt',
              }),
            ],
          }),
          new ComponentAttribute({
            name: null,
            type: 'Object',
            definition: containerVolumeMountDef,
            value: [
              new ComponentAttribute({
                name: 'name',
                type: 'String',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'name'),
                value: 'secret-mount',
              }),
              new ComponentAttribute({
                name: 'mountPath',
                type: 'String',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'mountPath'),
                value: '/mnt/secret',
              }),
            ],
          }),
          new ComponentAttribute({
            name: null,
            type: 'Object',
            definition: containerVolumeMountDef,
            value: [
              new ComponentAttribute({
                name: 'name',
                type: 'String',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'name'),
                value: 'pvc-mount',
              }),
              new ComponentAttribute({
                name: 'mountPath',
                type: 'String',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'mountPath'),
                value: '/mnt/pvc',
              }),
              new ComponentAttribute({
                name: 'readOnly',
                type: 'Boolean',
                definition: containerVolumeMountDef.definedAttributes.find(({ name }) => name === 'readOnly'),
                value: true,
              }),
            ],
          }),
        ],
      }),
      new ComponentAttribute({
        name: 'parent',
        type: 'String',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'parent'),
        value: 'pod-in-deployment',
      }),
      new ComponentAttribute({
        name: 'isInitContainer',
        type: 'Boolean',
        definition: containerDef.definedAttributes.find(({ name }) => name === 'isInitContainer'),
        value: false,
      }),
    ],
  }),
];
