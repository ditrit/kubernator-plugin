import { DefaultRender } from 'leto-modelizer-plugin-core';

/**
 * Class to render Kubernetes files from components.
 */
class KubernetesRenderer extends DefaultRender {
  /**
   * Convert all provided components and links in terraform files.
   * @return {FileInput[]} - Array of generated files from components and links.
   */
  render() {
    /*
     * Implement your own parse function here.
     */
    return [];
  }
}

export default KubernetesRenderer;
