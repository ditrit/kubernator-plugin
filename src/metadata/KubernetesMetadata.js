import { DefaultMetadata } from 'leto-modelizer-plugin-core';

/**
 * Class to validate and retrieve components definitions from Kubernetes metadata.
 */
class KubernetesMetadata extends DefaultMetadata {
  validate() {
    return super.validate();
  }

  /*
   * Implement this to provide all the definitions describing the components and the links.
   *
   * ComponentDefinition is used to generate the instantiable component list.
   *
   * And the componentAttributeDefinition is used to generate the form to update a component.
   *
   * Both of them can be also used to check components in parser and generate error.
   */
  parse() {
    this.pluginData.definitions = {
      components: [],
    };
  }
}

export default KubernetesMetadata;
