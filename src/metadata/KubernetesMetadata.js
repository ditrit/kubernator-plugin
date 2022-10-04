import { DefaultMetadata } from 'leto-modelizer-plugin-core';

/*
 * Metadata is used to generate definition of Component, ComponentAttribute and ComponentLink.
 *
 * In our plugin managing Terraform, we use [Ajv](https://ajv.js.org/) to validate metadata.
 * And we provide a `metadata.json` to define all metadata.
 *
 * Feel free to manage your metadata as you wish.
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
  getDefinitions() {
    return {
      components: [],
      links: [],
    };
  }
}

export default KubernetesMetadata;
