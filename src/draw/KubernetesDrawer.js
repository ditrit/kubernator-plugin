import { DefaultDrawer } from 'leto-modelizer-plugin-core';

/**
 * Class to draw Kubernetes components.
 */
class KubernetesDrawer extends DefaultDrawer {
  constructor(pluginData, resources, events, rootId, options) {
    super(pluginData, resources, events, rootId, {
      ...options,
      minHeight: 80,
      minWidth: 110,
      margin: 10,
      padding: 20,
    });
  }
}

export default KubernetesDrawer;
