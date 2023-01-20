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
    /**
     * Parsed subcomponent.
     * Special case to create the Pod template of the Deployment as a child component.
     */
    this.childrenComponentsByType = {};
  }

  /**
   * Function called when attribute `root` is parsed.
   * Create a component from the parsed root element.
   *
   * @param {MapNode} rootNode - The Lidy `root` node.
   */
  exit_root(rootNode) {
    console.log('ROOT');
    const apiVersion = rootNode.value.apiVersion.value;
    const kind = rootNode.value.kind.value;

    // apiVersion and kind are read-only in the model view because they
    // determine the component's type (definition), which is static in the UI.
    // So, we don't want to create attributes for them.
    delete rootNode.value.apiVersion;
    delete rootNode.value.kind;

    this.component = this.createComponentFromTree(rootNode, apiVersion, kind);
    this.component.path = this.fileInformation.path;
    this.component.children = this.childrenComponentsByType[this.component.definition.type] || [];
  }

  /**
   * Function called when attribute `podTemplate` is parsed.
   * Special case to create the template Pod template of the Deployment as a child component.
   * This function is called before exit_root for Deployment resources.
   *
   * @param {MapNode} deploymentSpecNode - The Lidy `deploymentSpec` node.
   */
  exit_deploymentSpec(deploymentSpecNode) {
    if (deploymentSpecNode.value.template) {
      const podComponent = this.createComponentFromTree(
        deploymentSpecNode.value.template, 'v1', 'Pod'
      );
      this.childrenComponentsByType['Deployment'] = [podComponent];
      podComponent.children = this.childrenComponentsByType["Pod"] || [];
      delete deploymentSpecNode.value.template; // prevent exit_root from visiting this node again
    }
  }

  exit_podSpec(podSpecNode) {
    this.childrenComponentsByType['Pod'] = [];
    const k8sContainerTypes = [
      {kind: 'Container', attributeName: 'containers'},
      {kind: 'InitContainer', attributeName: 'initContainers'},
    ];
    k8sContainerTypes.forEach((k8sContainerType) => {
      const k8sContainersNode = podSpecNode.value[k8sContainerType.attributeName];
      if (k8sContainersNode) {
        const k8sContainerComponents = k8sContainersNode.value.map(
          (containerNode) => this.createComponentFromTree(
            containerNode, 'others', 'Container'
          ));
        this.childrenComponentsByType['Pod'].push(...k8sContainerComponents);
        delete podSpecNode.value[k8sContainerType.attributeName]; // prevent exit_root from visiting this node again
      }
    });
  }

  exit_container(containerNode) {
    console.log('CONTAINER');
  }

  createComponentFromTree(node, apiVersion, kind) {
    const name = node.value.metadata?.value.name?.value || node.value.name?.value || 'random'; // TODO: confirm if we need to generate a random name here
    delete node.value.metadata?.value.name; // we don't want to create an attribute for the name, because the component already has a name
    delete node.value.name; // TODO: improve this
    const definition = this.definitions.find((definition) =>
      definition.apiVersion === apiVersion && definition.type === kind
    );
    return new Component({
      id: name, // TODO: confirm id == name ?
      name,
      definition,
      attributes: this.createAttributesFromTreeNode(node, definition),
    });
  }

  createAttributesFromTreeNode(parentNode, parentDefinition) {
    return Object.keys(parentNode.value).map(childKey => {
      const childNode = parentNode.value[childKey];
      const definition = parentDefinition?.definedAttributes.find(
        ({ name }) => name === (parentNode.type !== 'list' ? childKey: null)
      ); // note: elements inside a list don't have a name, because it has to match the definition
      return new ComponentAttribute({
        name: childKey,
        type: this.lidyToLetoType(childNode.type),
        definition,
        value: (childNode.type === 'map' || childNode.type === 'list') ?
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
   * @param {Number} value - the `uint16` value to check.
   */
  exit_uint16({ value }) {
    if (value < 0 || value >= 2**16) {
      // TODO: throw error
    }
  }
}

export default KubernetesListener;
