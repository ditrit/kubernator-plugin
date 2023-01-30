import {
  ComponentAttributeDefinition,
  DefaultMetadata,
} from 'leto-modelizer-plugin-core';
import KubernetesComponentDefinition from '../models/KubernetesComponentDefinition';
import metadata from '../assets/metadata';

/**
 * Class to validate and retrieve component definitions from Kubernetes metadata.
 */
class KubernetesMetadata extends DefaultMetadata {
  constructor(pluginData) {
    super(pluginData);
    this.commonAttributes = metadata.commonAttributes
      .map(this.getAttributeDefinition, this);
  }

  /**
   * Validate the provided metadata with a schemas.
   *
   * @returns {boolean} True if metadata is valid.
   */
  validate() {
    return true;
  }

  /**
   * Parse all component definitions from metadata.
   */
  parse() {
    const componentDefs = Object.keys(metadata.apiVersions).flatMap(
      (apiVersion) => metadata.apiVersions[apiVersion].map(
        (component) => this.getComponentDefinition(apiVersion, component)
      )
    );
    this.setChildrenTypes(componentDefs);
    this.pluginData.definitions.components = componentDefs;
  }

  /**
   * Convert a JSON component definition object to a KubernetesComponentDefinition.
   *
   * @param {string} apiVersion - Kubernetes API version of the component definition.
   * @param {object} component - JSON component definition object to parse.
   * @returns {KubernetesComponentDefinition} Parsed component definition.
   */
  getComponentDefinition(apiVersion, component) {
    const attributes = component.attributes || [];
    return new KubernetesComponentDefinition({
      apiVersion,
      ...component,
      definedAttributes: this.commonAttributes.concat(
        attributes.map(this.getAttributeDefinition, this)
      )
    });
  }

  /**
   * Convert a JSON attribute object to a ComponentAttributeDefinition.
   *
   * @param {object} attribute - JSON attribute definition object to parse.
   * @returns {ComponentAttributeDefinition} Parsed attribute definition.
   */
  getAttributeDefinition(attribute) {
    const subAttributes = attribute.attributes || [];
    return new ComponentAttributeDefinition({
      ...attribute,
      definedAttributes: subAttributes.map(this.getAttributeDefinition, this),
    });
  }

  /**
   * Set the childrenTypes of all containers from children's parentType.
   *
   * @param {ComponentDefinition[]} componentDefinitions - Array of component definitions.
   */
  setChildrenTypes(componentDefinitions) {
    const children = componentDefinitions
      .filter((def) => def.parentTypes.length > 0)
      .reduce((acc, def) => {
        def.parentTypes.forEach((parentType) => {
          acc[parentType] = [...(acc[parentType] || []), def.type];
        });
        return acc;
      }, {});
    componentDefinitions.filter((def) => children[def.type])
      .forEach((def) => {
        def.childrenTypes = children[def.type];
      });
  }
}

export default KubernetesMetadata;
