import { DefaultParser } from 'leto-modelizer-plugin-core';
import { parse as lidyParse } from 'src/lidy/k8s';
import KubernetesListener from 'src/parser/KubernetesListener';

/**
 *  Class to parse and retrieve components/links from Kubernetes files.
 */
class KubernetesParser extends DefaultParser {
  /**
   * Indicate if this parser can parse this file.
   * @param {FileInformation} [fileInformation] - File information.
   * @return {Boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return /^.*\.yml$/.test(fileInformation.path);
  }

  /**
   * Convert the content of files into Components.
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
   * @return {Object} - Object that contains all components, links and errors.
   */
  parse(inputs = []) {
    const components = [];
    inputs.forEach((input) => {
      const listener = new KubernetesListener(input, this.definitions.components);

      lidyParse({
        src_data: input.content,
        listener,
        path: input.path,
        prog: {
          errors: [],
          warnings: [],
          imports: [],
          alreadyImported: [],
          root: [],
        },
      });

      components.push(listener.component);
    });

    return {
      components,
      links: [],
      errors: [],
    };
  }
}

export default KubernetesParser;
