import {
  DefaultPlugin,
  DefaultData,
} from 'leto-modelizer-plugin-core';
import KubernetesDrawer from 'src/draw/KubernetesDrawer';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesParser from 'src/parser/KubernetesParser';
import KubernetesRenderer from 'src/render/KubernetesRenderer';
import { name, version } from 'package.json';

/**
 * Kubernetes plugin.
 */
class KubernetesPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */
  constructor() {
    const pluginData = new DefaultData({
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
