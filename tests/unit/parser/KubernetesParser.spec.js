import fs from 'fs';
import KubernetesParser from 'src/parser/KubernetesParser';
import { FileInput, FileInformation, DefaultData } from 'leto-modelizer-plugin-core';

describe('Test KubernetesParser', () => {
  describe('Test functions', () => {
    describe('Test function: isParsable', () => {
      it('Should return true on simple.yml', () => {
        const parser = new KubernetesParser();
        const file = new FileInformation({ path: 'simple.yml' });

        expect(parser.isParsable(file)).toEqual(true);
      });

      it('Should return false on simple.tf', () => {
        const parser = new KubernetesParser();
        const file = new FileInformation({ path: 'simple.tf' });

        expect(parser.isParsable(file)).toEqual(false);
      });
    });

    describe('Test function: parse', () => {
      it('Should return empty components on no input files', () => {
        const pluginData = new DefaultData();
        const parser = new KubernetesParser(pluginData);
        parser.parse();

        expect(pluginData.components).not.toBeNull();
        expect(pluginData.components.length).toEqual(0);
      });

      it('Parse simple.yml should return valid component', () => {
        const pluginData = new DefaultData();
        const parser = new KubernetesParser(pluginData);
        const file = new FileInput({
          path: './simple.yml',
          content: fs.readFileSync('tests/resources/yml/simple.yml', 'utf8'),
        });
        parser.parse([file]);

        expect(pluginData.components).not.toBeNull();
        expect(pluginData.components.length).toEqual(1);
      });
    });
  });
});
