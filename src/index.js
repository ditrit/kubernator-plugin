import KubernetesDrawer from 'src/draw/KubernetesDrawer';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesParser from 'src/parser/KubernetesParser';
import KubernetesRenderer from 'src/render/KubernetesRenderer';

/*
 * your plugins, for instance :
 *
 * import KubernetesDrawer from './draw/KubernetesDrawer';
 * will be replaced by
 * import [NameOfYourPlugin]Drawer from './draw/[NameOfYourPlugin]Drawer';
 *
 * Leto-modelizer expects to receive from this plugin an Object containing those properties:
 * - PluginDrawer
 * - PluginMetadata
 * - PluginParser
 * - PluginRenderer
 * - resources
 */
export default {
  PluginDrawer: KubernetesDrawer,
  PluginMetadata: KubernetesMetadata,
  PluginParser: KubernetesParser,
  PluginRenderer: KubernetesRenderer,
};
