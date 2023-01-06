import fs from 'fs';
import KubernetesParser from 'src/parser/KubernetesParser';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import { FileInput, FileInformation, DefaultData } from 'leto-modelizer-plugin-core';
import deploymentComponent from 'tests/resources/yml/deployment';

describe('Test KubernetesParser', () => {
  describe('Test functions', () => {
    describe('Test function: isParsable', () => {
      it('Should return true on .yml file', () => {
        const parser = new KubernetesParser();
        const file = new FileInformation({ path: 'simple.yml' });

        expect(parser.isParsable(file)).toEqual(true);
      });

      it('Should return true on .yaml file', () => {
        const parser = new KubernetesParser();
        const file = new FileInformation({ path: 'simple.yaml' });

        expect(parser.isParsable(file)).toEqual(true);
      });

      it('Should return false on file that is not a YAML file', () => {
        const parser = new KubernetesParser();
        const file = new FileInformation({ path: 'file.txt' });

        expect(parser.isParsable(file)).toEqual(false);
      });

      // it('Should return false on missing file', () => {
      //   const parser = new KubernetesParser();
      //   const file = new FileInformation({ path: 'missing_file.yml' });
      //
      //   expect(parser.isParsable(file)).toEqual(false);
      // });

      it('Should return false on wrong file', () => {
        const parser = new KubernetesParser();
        const file = new FileInformation({ path: '.github/workflows/simple.tf' });

        expect(parser.isParsable(file)).toEqual(false);
      });
    });

    describe('Test function: parse', () => {
      // it('Should set empty components on no input files', () => {
      //   const pluginData = new DefaultData();
      //   const parser = new KubernetesParser(pluginData);
      //   parser.parse();
      //
      //   expect(pluginData.components).not.toBeNull();
      //   expect(pluginData.components.length).toEqual(0);
      // });

      it('Parse simple.yml should set valid component', () => {
        const pluginData = new DefaultData();
        const metadata = new KubernetesMetadata(pluginData);
        metadata.parse();
        const parser = new KubernetesParser(pluginData);
        const file = new FileInput({
          path: './deployment.yml',
          content: fs.readFileSync('tests/resources/yml/deployment.yml', 'utf8'),
        });
        parser.parse([file]);

        expect(pluginData.components).toEqual([deploymentComponent]);
      });
    });
  });
});
