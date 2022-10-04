import { DefaultRender } from 'leto-modelizer-plugin-core';

class KubernetesRenderer extends DefaultRender {
  /*
   * The purpose of this function is to generate the content of one file.
   *
   * You have to map all the given components and links into a file content.
   */
  // eslint-disable-next-line no-unused-vars
  render(components = [], links = [], defaultFileName = null) {
    /*
     * Implement your own parse function here.
     */
    return '';
  }
}

export default KubernetesRenderer;
