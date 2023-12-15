import { DefaultPlugin } from 'leto-modelizer-plugin-core';
import KubernetesConfiguration from 'src/models/KubernetesConfiguration';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesDrawer from 'src/draw/KubernetesDrawer';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesParser from 'src/parser/KubernetesParser';
import KubernetesRenderer from 'src/render/KubernetesRenderer';
import packageInfo from 'package.json';

/**
 * Kubernetes plugin.
 */
class KubernetesPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {object} [props.event] - Event manager.
   * @param {Function} [props.event.next] - Function to emit event.
   */
  constructor(props = {
    event: null,
  }) {
    const configuration = new KubernetesConfiguration();
    const pluginData = new KubernetesData(configuration, {
      name: packageInfo.name,
      version: packageInfo.version,
    }, props.event);

    super({
      configuration,
      pluginData,
      pluginDrawer: new KubernetesDrawer(pluginData),
      pluginMetadata: new KubernetesMetadata(pluginData),
      pluginParser: new KubernetesParser(pluginData),
      pluginRenderer: new KubernetesRenderer(pluginData),
    });
  }
}

export default KubernetesPlugin;
