import { DefaultMetadata } from '@ditrit/leto-modelizer-plugin-core';
import KubernetesComponentDefinition from '../models/KubernetesComponentDefinition';
import KubernetesComponentAttributeDefinition from '../models/KubernetesComponentAttributeDefinition';
import metadata from '../assets/metadata';

/**
 * Class to retrieve KubernetesComponentDefinitions from metadata JSON files.
 */
class KubernetesMetadata extends DefaultMetadata {
  /**
   * Parse all KubernetesComponentDefinitions from metadata JSON files.
   */
  parse() {
    const commonAttributes = metadata.commonAttributes.map(this.__createAttributeDefinition, this);
    this.pluginData.definitions.components = Object.keys(metadata.apiVersions)
      .flatMap((apiVersion) => metadata.apiVersions[apiVersion]
        .map((rawComponentDefinition) => this.__createComponentDefinition(
          apiVersion,
          rawComponentDefinition,
          commonAttributes,
        )));
    this.__setChildrenTypes();
  }

  /**
   * Create a KubernetesComponentDefinition from a raw object, and add common attributes to its
   * defined attributes.
   * @param {string} apiVersion - Kubernetes API version of the component definition.
   * @param {object} rawComponentDefinition - Raw object with the component definition properties.
   * @param {KubernetesComponentAttributeDefinition[]} commonAttributes - Attribute definitions
   * common to all components (except those in apiVersion "others").
   * @returns {KubernetesComponentDefinition} The newly created component definition.
   */
  __createComponentDefinition(apiVersion, rawComponentDefinition, commonAttributes) {
    const definedAttributes = rawComponentDefinition.attributes
      ?.map(this.__createAttributeDefinition, this) || [];
    if (apiVersion !== 'others') {
      // Components in apiVersion "others" are subresources, so they don't have common attributes
      // (e.g. K8S "metadata" object). These logical components are only meant to be children of
      // Leto container components, and only exist to simplify the graphical representation and
      // minimize attributes nesting. Moreover, apiVersion "others" does not exist for the K8S API,
      // it is just a convenient way to group them for the purpose of this plugin.
      definedAttributes.unshift(...commonAttributes);
    }
    return new KubernetesComponentDefinition({
      ...rawComponentDefinition,
      definedAttributes,
      apiVersion,
      ignoredAttributes: [
        'apiVersion', // apiVersion is tied the definition
        'kind', // kind is tied to the definition
        'name', // name is stored as the component's id
        'status', // status is read-only
      ], // so we can ignore them (we don't need to parse them as attributes)
    });
  }

  /**
   * Create a KubernetesComponentAttributeDefinition from a raw object.
   * @param {object} rawAttributeDefinition - Raw object with the attribute definition properties.
   * @returns {KubernetesComponentAttributeDefinition} The newly created attribute definition.
   */
  __createAttributeDefinition(rawAttributeDefinition) {
    return new KubernetesComponentAttributeDefinition({
      ...rawAttributeDefinition,
      displayName: rawAttributeDefinition.displayName
        || this.__getDefaultDisplayName(rawAttributeDefinition.name),
      definedAttributes: rawAttributeDefinition.attributes
        ?.map(this.__createAttributeDefinition, this) || [],
    });
  }

  /**
   * Format an attribute name into a more user friendly display name.
   * @param {string} name - The attribute name to format.
   * @returns {string} The formatted display name.
   */
  __getDefaultDisplayName(name) {
    if (!name || name.includes('.')) {
      // Names such as "app.kubernetes.io/version" are not uppercased because it would look ugly.
      return name;
    }
    const s = name.replace(/[A-Z]/g, ' $&');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   * Set the "childrenTypes" property of all component definitions
   * from the "parentType" property of children component definitions.
   */
  __setChildrenTypes() {
    const childrenByType = this.pluginData.definitions.components
      .reduce((acc, { type, parentTypes }) => {
        parentTypes.forEach((parentType) => {
          acc[parentType] ||= [];
          acc[parentType].push(type);
        });
        return acc;
      }, {});
    this.pluginData.definitions.components.forEach((definition) => {
      definition.childrenTypes = childrenByType[definition.type] || [];
    });
  }
}

export default KubernetesMetadata;
