import KubernetesData from 'src/models/KubernetesData';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesParser from 'src/parser/KubernetesParser';

import configmapComponents from 'tests/resources/js/simple/configmap';
import cronjobComponents from 'tests/resources/js/simple/cronjob';
import deploymentComponents from 'tests/resources/js/simple/deployment';
import ingressComponents from 'tests/resources/js/simple/ingress';
import jobComponents from 'tests/resources/js/simple/job';
import podComponents from 'tests/resources/js/simple/pod';
import pvcComponents from 'tests/resources/js/simple/pvc';
import secretComponents from 'tests/resources/js/simple/secret';
import serviceComponents from 'tests/resources/js/simple/service';
import statefulsetComponents from 'tests/resources/js/simple/statefulset';

import {
  Component,
  ComponentAttribute,
  FileInput,
  FileInformation,
  ParseError,
} from 'leto-modelizer-plugin-core';
import fs from 'fs';

describe('Test class: KubernetesParser', () => {
  describe('Test method: isParsable', () => {
    it('Should return true for file names with .yaml extension', () => {
      const parser = new KubernetesParser();

      expect(parser.isParsable(new FileInformation({ path: 'deployment.yaml' }))).toEqual(true);
      expect(parser.isParsable(new FileInformation({ path: 'folder/service.yaml' }))).toEqual(true);
    });

    it('Should return true for file names with .yml extension', () => {
      const parser = new KubernetesParser();

      expect(parser.isParsable(new FileInformation({ path: 'deployment.yml' }))).toEqual(true);
      expect(parser.isParsable(new FileInformation({ path: 'folder/service.yml' }))).toEqual(true);
    });

    it('Should return false for other file names', () => {
      const parser = new KubernetesParser();

      expect(parser.isParsable(new FileInformation({ path: 'deployment.js' }))).toEqual(false);
      expect(parser.isParsable(new FileInformation({ path: 'folder/service' }))).toEqual(false);
    });

    it('Should return false for github workflow files', () => {
      const parser = new KubernetesParser();

      expect(parser.isParsable(new FileInformation({ path: 'deployment.js' }))).toEqual(false);
      expect(parser.isParsable(new FileInformation({ path: 'folder/service' }))).toEqual(false);
    });

    it('Should return false if a FileInput is passed and the file is missing kind or apiVersion', () => {
      const parser = new KubernetesParser();

      expect(parser.isParsable(new FileInput({
        path: 'no_kind.yaml',
        content: fs.readFileSync('tests/resources/yaml/advanced/no_kind.yaml', 'utf8'),
      }))).toEqual(false);
      expect(parser.isParsable(new FileInput({
        path: 'no_api_version.yaml',
        content: fs.readFileSync('tests/resources/yaml/advanced/no_api_version.yaml', 'utf8'),
      }))).toEqual(false);
    });
  });

  describe('Test method: getModels', () => {
    it('Should return an empty array if there are no parameters', () => {
      const parser = new KubernetesParser();
      expect(parser.getModels()).toStrictEqual([]);
    });
    it('Should return an empty array if there are no files', () => {
      const parser = new KubernetesParser();
      expect(parser.getModels([])).toStrictEqual([]);
    });
    it('Should return the path of folders that contain parsable files', () => {
      const parser = new KubernetesParser();
      const files = [
        new FileInformation({ path: 'kubernetes/notes/notes.txt' }),
        new FileInformation({ path: 'kubernetes/README.md' }),
        new FileInformation({ path: 'kubernetes/infra1/service.yaml' }),
        new FileInformation({ path: 'config.yml' }),
        new FileInformation({ path: 'kubernetes/deployment.yaml' }),
        new FileInformation({ path: 'common/README.md' }),
        new FileInformation({ path: 'kubernetes/infra1/ingress.yaml' }),
      ];
      expect(parser.getModels(files)).toStrictEqual(['kubernetes/infra1', '', 'kubernetes']);
    });
  });

  describe('Test method: parse', () => {
    /**
     * Parse input files and return the KubernetesData.
     * @param {FileInput[]} fileInputs - Input files to parse.
     * @returns {KubernetesData} Plugin data instance with parsed components and errors.
     */
    function parse(fileInputs) {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      const parser = new KubernetesParser(pluginData);
      const diagram = new FileInformation({ path: '' });

      metadata.parse();
      parser.parse(diagram, fileInputs);

      return pluginData;
    }

    it('Should parse simple yaml files and set expected components', () => {
      const pluginData = parse([
        new FileInput({ path: 'configmap.yaml', content: fs.readFileSync('tests/resources/yaml/simple/configmap.yaml', 'utf8') }),
        new FileInput({ path: 'cronjob.yaml', content: fs.readFileSync('tests/resources/yaml/simple/cronjob.yaml', 'utf8') }),
        new FileInput({ path: 'deployment.yaml', content: fs.readFileSync('tests/resources/yaml/simple/deployment.yaml', 'utf8') }),
        new FileInput({ path: 'ingress.yaml', content: fs.readFileSync('tests/resources/yaml/simple/ingress.yaml', 'utf8') }),
        new FileInput({ path: 'job.yaml', content: fs.readFileSync('tests/resources/yaml/simple/job.yaml', 'utf8') }),
        new FileInput({ path: 'pod.yaml', content: fs.readFileSync('tests/resources/yaml/simple/pod.yaml', 'utf8') }),
        new FileInput({ path: 'pvc.yaml', content: fs.readFileSync('tests/resources/yaml/simple/pvc.yaml', 'utf8') }),
        new FileInput({ path: 'secret.yaml', content: fs.readFileSync('tests/resources/yaml/simple/secret.yaml', 'utf8') }),
        new FileInput({ path: 'service.yaml', content: fs.readFileSync('tests/resources/yaml/simple/service.yaml', 'utf8') }),
        new FileInput({ path: 'statefulset.yaml', content: fs.readFileSync('tests/resources/yaml/simple/statefulset.yaml', 'utf8') }),
      ]);
      expect(pluginData.components).toStrictEqual([
        ...configmapComponents,
        ...cronjobComponents,
        ...deploymentComponents,
        ...ingressComponents,
        ...jobComponents,
        ...podComponents,
        ...pvcComponents,
        ...secretComponents,
        ...serviceComponents,
        ...statefulsetComponents,
      ]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });

    it('Should set empty components if there are no files', () => {
      const pluginData = parse();
      expect(pluginData.components).toStrictEqual([]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });

    it('Should set empty components if input files are empty', () => {
      const pluginData = parse([
        new FileInput({ path: 'a', content: null }),
        new FileInput({ path: 'b', content: '' }),
        new FileInput({ path: 'c', content: ' ' }),
      ]);
      expect(pluginData.components).toStrictEqual([]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });

    it('Should create parse errors if a component is missing kind/apiVersion property', () => {
      const pluginData = parse([
        new FileInput({ path: 'no_kind.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/no_kind.yaml', 'utf8') }),
        new FileInput({ path: 'no_kind.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/no_api_version.yaml', 'utf8') }),
        new FileInput({ path: 'broken.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/broken.yaml', 'utf8') }),
      ]);
      expect(pluginData.components).toStrictEqual([]);
      expect(pluginData.parseErrors).toStrictEqual([
        new ParseError({ message: 'File "/no_kind.yaml" is missing apiVersion or kind.' }),
        new ParseError({ message: 'File "/no_api_version.yaml" is missing apiVersion or kind.' }),
        new ParseError({ message: 'File "/broken.yaml" is missing apiVersion or kind.' }),
      ]);
    });

    it('Should create an UnknownResource component if a component kind/apiVersion does not match any definition', () => {
      const pluginData = parse([
        new FileInput({ path: 'unknown_resource.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/unknown_resource.yaml', 'utf8') }),
      ]);
      expect(pluginData.components).toStrictEqual([new Component({
        id: 'id_1',
        path: 'unknown_resource.yaml',
        definition: pluginData.definitions.components.find(({ type }) => type === 'UnknownResource'),
      })]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });

    it('Should create a selector link attribute with empty array value if the target component has no labels', () => {
      const pluginData = parse([
        new FileInput({ path: 'service.yaml', content: fs.readFileSync('tests/resources/yaml/simple/service.yaml', 'utf8') }),
        new FileInput({ path: 'no_labels.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/no_labels.yaml', 'utf8') }),
      ]);
      expect(pluginData.components[0].getAttributeByName('selector').value).toStrictEqual([]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });

    it('Should create a selector link attribute with empty array value if the target component does not exist', () => {
      const pluginData = parse([
        new FileInput({ path: 'wrong_link_selector.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/wrong_link_selector.yaml', 'utf8') }),
      ]);
      expect(pluginData.components[0].getAttributeByName('selector').value).toStrictEqual([]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });

    it('Should parse float attributes correctly', () => {
      const pluginData = parse([
        new FileInput({ path: 'float_attribute.yaml', content: fs.readFileSync('tests/resources/yaml/advanced/float_attribute.yaml', 'utf8') }),
      ]);
      const podDef = pluginData.definitions.components
        .find(({ type }) => type === 'Pod');
      expect(pluginData.components).toStrictEqual([new Component({
        id: 'id_1',
        path: 'float_attribute.yaml',
        definition: podDef,
        attributes: [new ComponentAttribute({
          name: 'pi',
          type: 'Number',
          definition: podDef.definedAttributes.find(({ name }) => name === 'pi'),
          value: 3.14,
        })],
      })]);
      expect(pluginData.parseErrors).toStrictEqual([]);
    });
  });
});
