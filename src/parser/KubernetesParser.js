import { DefaultParser } from 'leto-modelizer-plugin-core';
import { parse as lidyParse } from '../lidy/k8s';
import KubernetesListener from './KubernetesListener';

/**
 *  Class to parse and retrieve components from Kubernetes files.
 */
class KubernetesParser extends DefaultParser {
  /**
   * Indicate if this parser can parse this file.
   *
   * @param {FileInformation} [fileInformation] - File information.
   * @returns {boolean} Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return /\.ya?ml$/.test(fileInformation.path);
  }

  /**
   * Convert the content of files into Components.
   *
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
   */
  parse(inputs = []) {
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];

    inputs.forEach((input) => {
      const listener = new KubernetesListener(input, this.pluginData.definitions.components);

      const errors = [];
      const warnings = [];
      const imports = [];
      const alreadyImported = [];
      const root = [];

      lidyParse({
        src_data: input.content,
        listener,
        path: input.path,
        prog: {
          errors: errors,
          warnings: warnings,
          imports: imports,
          alreadyImported: alreadyImported,
          root: root,
        },
      });

      console.log(errors);
      console.log(warnings);
      console.log(imports);
      console.log(alreadyImported);
      console.log(root);

      this.pluginData.components.push(...listener.components);
    });
    console.log('P', this.pluginData.components);
  }
}

export default KubernetesParser;
