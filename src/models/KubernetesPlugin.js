import { DefaultPlugin, DefaultConfiguration } from 'leto-modelizer-plugin-core';
import KubernetesData from './KubernetesData';
import KubernetesDrawer from '../draw/KubernetesDrawer';
import KubernetesMetadata from '../metadata/KubernetesMetadata';
import KubernetesParser from '../parser/KubernetesParser';
import KubernetesRenderer from '../render/KubernetesRenderer';
import packageInfo from '../../package.json';

/**
 * Kubernetes plugin.
 */
class KubernetesPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   *
   * @param {object} [props] - Object that contains all properties to set.
   * @param {object} [props.event] - Event manager.
   * @param {Function} [props.event.next] - Function to emit event.
   */
  constructor(props = {
    event: null,
  }) {
    const configuration = new DefaultConfiguration();
    const pluginData = new KubernetesData(configuration, {
      name: packageInfo.name,
      version: packageInfo.version,
    }, props.event);

    super({
      pluginData,
      pluginDrawer: new KubernetesDrawer(pluginData),
      pluginMetadata: new KubernetesMetadata(pluginData),
      pluginParser: new KubernetesParser(pluginData),
      pluginRenderer: new KubernetesRenderer(pluginData),
      configuration,
    });
  }
}

export default KubernetesPlugin;
