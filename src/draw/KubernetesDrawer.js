import { DefaultDrawer } from 'leto-modelizer-plugin-core';

/**
 * Class to draw Kubernetes components.
 */
class KubernetesDrawer extends DefaultDrawer {
  constructor(pluginData, resources, rootId, options, layout) {
    super(pluginData, resources, rootId, {
      ...options,
      minHeight: 80,
      minWidth: 110,
      margin: 10,
      padding: 20,
    },
    layout);
  }
}

export default KubernetesDrawer;
