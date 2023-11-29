import { DefaultDrawer } from 'leto-modelizer-plugin-core';

/**
 * Class to draw Kubernetes components.
 */
class KubernetesDrawer extends DefaultDrawer {
  /**
   * Default constructor
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} [resources] - Object that contains resources.
   * @param {string} [rootId] - Id of HTML element where we want to draw.
   * @param {object} [options] - Rendering options.
   * @param {number} [options.minWidth] - Minimum width of a component.
   * @param {number} [options.minHeight] - Minimum height of a component.
   * @param {number} [options.padding] - Padding around a component.
   * @param {number} [options.margin] - Component margin thickness.
   * @param {number[]} [options.lineLengthPerDepth] - Number of components
   * per line at a given depth. Valid values: 1 - Infinity.
   * @param {number} [options.actionMenuButtonSize] - The size of each action menu button.
   * @param {DefaultLayout} [layout] - The manager for an automatic diagram layout.
   */
  constructor(pluginData, resources = null, rootId = 'root', options = {}, layout = null) {
    super(pluginData, resources, rootId, {
      ...options,
      minHeight: 80,
      minWidth: 110,
      margin: 10,
      padding: 20,
    }, layout);
  }
}

export default KubernetesDrawer;
