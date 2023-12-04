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
  /**
   * Parse all component definitions from metadata.
   */
  parse() {
    const commonAttributes = metadata.commonAttributes
      .map(this.__getAttributeDefinition, this);
    const componentDefs = Object.keys(metadata.apiVersions).flatMap(
      (apiVersion) => metadata.apiVersions[apiVersion].map(
        (component) => this.__getComponentDefinition(apiVersion, component, commonAttributes),
      ),
    );
    this.__setChildrenTypes(componentDefs);
    this.pluginData.definitions.components = componentDefs;
  }

  /**
   * Convert a JSON component definition object to a KubernetesComponentDefinition.
   * @param {string} apiVersion - Kubernetes API version of the component definition.
   * @param {object} component - JSON component definition object to parse.
   * @param {array} commonAttributes - Attributes common to all components.
   * @returns {KubernetesComponentDefinition} Parsed component definition.
   */
  __getComponentDefinition(apiVersion, component, commonAttributes) {
    const attributes = component.attributes || [];
    let definedAttributes = attributes.map(this.__getAttributeDefinition, this);
    if (apiVersion !== 'others') {
      definedAttributes = [
        ...commonAttributes,
        ...definedAttributes,
      ];
    }
    return new KubernetesComponentDefinition({
      apiVersion,
      ...component,
      definedAttributes,
    });
  }

  /**
   * Convert a JSON attribute object to a ComponentAttributeDefinition.
   * @param {object} attribute - JSON attribute definition object to parse.
   * @returns {ComponentAttributeDefinition} Parsed attribute definition.
   */
  __getAttributeDefinition(attribute) {
    const subAttributes = attribute.attributes || [];
    const attributeDef = new ComponentAttributeDefinition({
      ...attribute,
      displayName: attribute.displayName || this.__formatDisplayName(attribute.name),
      definedAttributes: subAttributes.map(this.__getAttributeDefinition, this),
    });
    return attributeDef;
  }

  /**
   * Set the childrenTypes of all containers from children's parentType.
   * @param {ComponentDefinition[]} componentDefinitions - Array of component definitions.
   */
  __setChildrenTypes(componentDefinitions) {
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

  __formatDisplayName(name) {
    if (!name || name.includes('.')) {
      return name;
    }
    const s = name.replace(/([A-Z])/g, ' $1');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export default KubernetesMetadata;
