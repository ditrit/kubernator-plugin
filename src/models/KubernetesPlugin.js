import { DefaultPlugin } from 'leto-modelizer-plugin-core';
import KubernetesData from './KubernetesData';
import KubernetesDrawer from '../draw/KubernetesDrawer';
import KubernetesMetadata from '../metadata/KubernetesMetadata';
import KubernetesParser from '../parser/KubernetesParser';
import KubernetesRenderer from '../render/KubernetesRenderer';
import { name, version } from '../../package.json';

/**
 * Kubernetes plugin.
 */
class KubernetesPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */
  constructor() {
    const pluginData = new KubernetesData({
      name,
      version,
    });

    super({
      pluginData,
      pluginDrawer: new KubernetesDrawer(pluginData),
      pluginMetadata: new KubernetesMetadata(pluginData),
      pluginParser: new KubernetesParser(pluginData),
      pluginRenderer: new KubernetesRenderer(pluginData),
    });
  }
}

export default KubernetesPlugin;
