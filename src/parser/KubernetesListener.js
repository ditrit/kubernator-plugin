import { Component } from 'leto-modelizer-plugin-core';

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
    this.component = new Component();
  }

  /**
   * Function call when attribute `kind` is parsed.
   *
   * @param {string} value - Kind value.
   */
  exit_kind({ value }) {
    this.component.definition = this.definitions
      .find((definition) => definition.type === value);
  }
}

export default KubernetesListener;
