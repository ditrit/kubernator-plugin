import { ComponentDefinition } from 'leto-modelizer-plugin-core';

/**
 * Specific Kubernetes component definition.
 * @extends {ComponentDefinition}
 */
class KubernetesComponentDefinition extends ComponentDefinition {
  /**
   * Override ComponentDefinition constructor with ...
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes=[]] - Defined attributes for
   * this type.
   * @see ComponentDefinition
   */
  constructor(props = {
    definedAttributes: [],
  }) {
    props.definedAttributes = props.definedAttributes.concat([
      {
        name: 'metadata',
        type: 'Object',
        required: true,
        definedAttributes: [
          {
            name: 'name',
            type: 'String',
            required: true,
          },
          {
            name: 'namespace',
            type: 'String',
            required: false,
          },
          {
            name: 'labels',
            type: 'Object',
            required: false,
          },
          {
            name: 'annotations',
            type: 'Object',
            required: false,
          },
        ],
      },
    ]);
    super(props);
  }
}

export default KubernetesComponentDefinition;
