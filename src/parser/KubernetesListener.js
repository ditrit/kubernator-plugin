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
     * Parsed components.
     */
    this.components = [];
    /**
     * Parsed subcomponent.
     * Special case to create the Pod template of the Deployment as a child component.
     */
    this.childComponentsByType = {};
  }

  /**
   * Function called when attribute `root` is parsed.
   * Create a component from the parsed root element.
   *
   * @param {MapNode} rootNode - The Lidy `root` node.
   */
  exit_root(rootNode) {
    const apiVersion = rootNode.value.apiVersion.value;
    const kind = rootNode.value.kind.value;

    // apiVersion and kind are read-only in the model view because they
    // determine the component's type (definition), which is static in the UI.
    // So, we don't want to create attributes for them.
    delete rootNode.value.apiVersion;
    delete rootNode.value.kind;

    const rootComponent = this.createComponentFromTree(rootNode, apiVersion, kind);
    rootComponent.path = this.fileInformation.path;
    rootComponent.definition.childrenTypes.forEach((childType) => {
      this.setParentComponent(rootComponent, this.childComponentsByType[childType]);
    });
  }

  /**
   * Function called when attribute `podTemplate` is parsed.
   * Special case to create the template Pod template of the Deployment as a child component.
   * This function is called before exit_root for Deployment resources.
   *
   * @param {MapNode} deploymentSpecNode - The Lidy `deploymentSpec` node.
   */
  exit_deploymentSpec(deploymentSpecNode) {
    const templateNode = deploymentSpecNode.value.template;
    if (templateNode && Object.keys(templateNode.value).length) {
      const podComponent = this.createComponentFromTree(
        templateNode, 'v1', 'Pod'
      );
      this.childComponentsByType['Pod'] = [podComponent];
      this.setParentComponent(
        podComponent,
        this.childComponentsByType["InitContainer"]?.concat(this.childComponentsByType["Container"]),
      );
      delete deploymentSpecNode.value.template; // prevent exit_root from visiting this node again
      delete deploymentSpecNode.selector; // we automatically copy the Pod's labels into the Deployment's selector, so we don't need to parse it
    }
  }

  exit_podSpec(podSpecNode) {
    const k8sContainerTypes = [
      {kind: 'InitContainer', attributeName: 'initContainers'},
      {kind: 'Container', attributeName: 'containers'},
    ];
    k8sContainerTypes.forEach((k8sContainerType) => {
      const k8sContainerComponents =
        podSpecNode.value[k8sContainerType.attributeName]?.value.map(
          (containerNode) => {
            const volumeMountComponents =
              this.createVolumeMountComponentsFromTree(containerNode, podSpecNode);
            const k8sContainerComponent = this.createComponentFromTree(
              containerNode, 'others', k8sContainerType.kind
            );
            this.setParentComponent(k8sContainerComponent, volumeMountComponents);
            return k8sContainerComponent;
          }
        ) || [];
      this.childComponentsByType[k8sContainerType.kind] = k8sContainerComponents;
      delete podSpecNode.value[k8sContainerType.attributeName]; // prevent exit_{deployment,statefulSet,job}Spec from visiting this node again
    });
    delete podSpecNode.value.volumes; // prevent exit_{deployment,statefulSet,job}Spec from visiting this node again
  }

  createVolumeMountComponentsFromTree(containerNode, podSpecNode) {
    const volumeNodes = podSpecNode.value.volumes?.value || [];
    const volumeComponents = [];
    containerNode.value.volumeMounts?.value.forEach((volumeMountNode) => {
      const volumeName = volumeMountNode.value.name.value;
      const volumeNode = volumeNodes.find(
        (volumeNode) => volumeNode.value.name.value === volumeName
      );
      if (!volumeNode) {
        // TODO: throw error
        return;
      }
      const volumeSpecKeys = Object.keys(volumeNode.value).filter(
        (key) => volumeNode.value[key].type === 'map'
      );
      if (volumeSpecKeys.length !== 1) {
        // TODO: throw error
        return;
      }
      const volumeSpecKey = volumeSpecKeys[0];
      const volumeKind = {
        configMap: 'ConfigMapMount',
        secret: 'SecretMount',
        persistentVolumeClaim: 'PersistentVolumeClaimMount',
      }[volumeSpecKey];
      if (!volumeKind) {
        // TODO: throw error
        return;
      }
      const volumeComponent = this.createComponentFromTree(
        volumeMountNode, 'others', volumeKind
      );
      volumeComponent.attributes.push(
        ...this.createAttributesFromTreeNode(
          volumeNode, volumeComponent.definition
        ).filter((attribute) => attribute.name !== 'name'),
      );
      volumeComponents.push(volumeComponent);
    });
    delete containerNode.value.volumeMounts; // prevent exit_podSpec from visiting this node again
    return volumeComponents;
  }

  exit_statefulSetSpec(statefulSetSpecNode) {
    this.exit_deploymentSpec(statefulSetSpecNode);
  }

  exit_cronJobSpec(cronJobSpecNode) {
    const jobTemplateNode = cronJobSpecNode.value.jobTemplate;
    if (jobTemplateNode && Object.keys(jobTemplateNode.value).length) {
      const jobComponent = this.createComponentFromTree(
        jobTemplateNode, 'batch/v1', 'Job'
      );
      this.childComponentsByType['Job'] = [jobComponent];
      this.setParentComponent(jobComponent, this.childComponentsByType["Pod"]);
      delete cronJobSpecNode.value.jobTemplate; // prevent exit_root from visiting this node again
    }
  }

  exit_jobSpec(jobSpecNode) {
    this.exit_deploymentSpec(jobSpecNode);
  }

  createComponentFromTree(node, apiVersion, kind) {
    const name = node.value.metadata?.value.name?.value || node.value.name?.value || 'random'; // TODO: confirm if we need to generate a random name here
    delete node.value.metadata?.value.name; // we don't want to create an attribute for the name, because the component already has a name
    delete node.value.name; // TODO: improve this
    const definition = this.definitions.find((definition) =>
      definition.apiVersion === apiVersion && definition.type === kind
    );
    const component = new Component({
      id: name, // TODO: confirm id == name ?
      name,
      definition,
      attributes: this.createAttributesFromTreeNode(node, definition),
    });
    this.components.push(component);
    return component;
  }

  createAttributesFromTreeNode(parentNode, parentDefinition) {
    return Object.keys(parentNode.value).map(childKey => {
      const childNode = parentNode.value[childKey];
      const definition = parentDefinition?.definedAttributes.find(
        ({ name }) => name === (parentNode.type !== 'list' ? childKey: null)
      ); // note: elements inside a list don't have a name, because it has to match the definition
      const attribute = new ComponentAttribute({
        name: childKey,
        type: this.lidyToLetoType(childNode.type),
        definition,
        value: (childNode.type === 'map' || childNode.type === 'list') ?
          this.createAttributesFromTreeNode(childNode, definition) :
          childNode.value,
      });
      if (definition && definition.type === 'Link') {
        if (attribute.name !== 'selector') {
          // DefaultDrawer expects Link attributes to be arrays.
          // Selectors are handled in KubernetesParser.
          attribute.value = [attribute.value]; 
        }
        attribute.type = 'Link';
      }
      return attribute;
    });
  }

  setParentComponent(parentComponent, childComponents) {
    childComponents?.forEach((childComponent) => {
      childComponent.setReferenceAttribute(parentComponent);
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
