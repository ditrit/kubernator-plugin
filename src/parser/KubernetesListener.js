import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';

/**
 * Lidy listener for Kubernetes files.
 */
class KubernetesListener {
  /**
   * Default constructor.
   *
   * @param {FileInformation} fileInformation - File information.
   * @param {ComponentDefinition[]} [definitions=[]] - All component definitions.
   */
  constructor(fileInformation, definitions = []) {
    /**
     * File information.
     *
     * @type {FileInformation}
     */
    this.fileInformation = fileInformation;
    /**
     * Array of component definitions.
     *
     * @type {ComponentDefinition[]}
     */
    this.definitions = definitions;
    /**
     * Parsed component.
     */
    this.component = null;
  }

  /**
   * Function called when attribute `root` is parsed.
   * Parse the root component.
   *
   * @param {string} value - Kind value.
   */
  exit_root(parsedRule) {
    const kind = parsedRule.value.kind.value;
    const apiVersion = parsedRule.value.apiVersion.value;

    // kind and apiVersion are read-only in the model view because they
    // determine the component's type (definition), which is static in the UI.
    // So, we don't want to create attributes for them.
    delete parsedRule.value.kind;
    delete parsedRule.value.apiVersion;

    this.component = this.createComponentFromTree(parsedRule, kind, apiVersion);
  }

  createComponentFromTree(rootNode, kind, apiVersion) {
    const name = rootNode.value.metadata?.value.name?.value || 'random'; // TODO: confirm if we need to generate a random name here
    const definition = this.definitions.find((definition) =>
      definition.type === kind && definition.apiVersion === apiVersion
    );
    return new Component({
      id: name, // TODO: confirm id == name ?
      name,
      definition,
      attributes: this.createAttributesFromTreeNode(rootNode, definition),
      path: this.fileInformation.path,
    });
  }

  createAttributesFromTreeNode(parentNode, parentDefinition) {
    return Object.keys(parentNode.value).map(childKey => {
      const childNode = parentNode.value[childKey];
      const definition = parentDefinition?.definedAttributes
          .find(({ name }) => name === childKey);
      return new ComponentAttribute({
        name: childKey,
        type: this.lidyToLetoType(childNode.type),
        definition,
        value: (childNode.type == 'map' || childNode.type == 'list') ?
          this.createAttributesFromTreeNode(childNode, definition) :
          childNode.value,
      });
    });
  }

  lidyToLetoType(lidyType) {
    switch (lidyType) {
      case 'string':
        return 'String';
      case 'boolean':
        return 'Boolean';
      case 'int':
      case 'float':
        return 'Number';
      case 'map':
        return 'Object';
      case 'list':
        return 'Array';
      default:
        return null; // TODO: throw error
    }
  }

  /**
   * Function called when attribute `uint16` is parsed.
   *
   * @param {string} value - Kind value.
   */
  exit_uint16({ value }) {
    if (value < 0 || value >= 2**16) {
      // TODO: throw error
    }
  }
}

export default KubernetesListener;

    // /**
    //  * Subcomponent (special case for compound specs, see src/lidy/k8s.yml).
    //  */
    // this.subComponent = null;

  // /**
  //  * Function called when attribute `podTemplate` is parsed.
  //  * Special case to parse the Pod subcomponent of the Deployment as a separate component.
  //  *
  //  * @param {string} value - Kind value.
  //  */
  // exit_aaa(parsedRule) {
  //   this.component = this.createComponent(
  //     parsedRule,
  //     paresedRule.value.kind.value,
  //     paresedRule.value.apiVersion.value
  //   );
  // }
