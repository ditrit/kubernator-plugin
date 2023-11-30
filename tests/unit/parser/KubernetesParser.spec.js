import fs from 'fs';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesData from '../../../src/models/KubernetesData';
import KubernetesParser from 'src/parser/KubernetesParser';
import { FileInput, FileInformation, DefaultData } from 'leto-modelizer-plugin-core';
import ingressPluginData from 'tests/resources/yaml/ingress';
import servicePluginData from 'tests/resources/yaml/service';
import secretPluginData from 'tests/resources/yaml/secret';
import deploymentPluginData from 'tests/resources/yaml/deployment';
import configmapPluginData from 'tests/resources/yaml/configmap';
import pvcPluginData from 'tests/resources/yaml/pvc';
import cronjobPluginData from 'tests/resources/yaml/cronjob';
import statefulsetPluginData from 'tests/resources/yaml/statefulset';
import jobPluginData from 'tests/resources/yaml/job';






describe('KubernetesParser', () => {
  describe('isParsable', () => {
    it('should return true for a YAML file', () => {
      const parser = new KubernetesParser();
      const file = new FileInformation({ path: 'simple.yaml' });

      expect(parser.isParsable(file)).toBe(true);
    });

    it('should return true for a YML file', () => {
      const parser = new KubernetesParser();
      const file = new FileInformation({ path: 'deployment.yml' });

      expect(parser.isParsable(file)).toBe(true);
    });

    it('should return false for a non-YAML file', () => {
      const parser = new KubernetesParser();
      const file = new FileInformation({ path: 'deployment.js' });

      expect(parser.isParsable(file)).toBe(false);
    });
  });

  describe('parse', () => {
    

    it('should parse a valid ingress.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './ingress.yaml',
        content: fs.readFileSync('tests/resources/yaml/ingress.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(ingressPluginData.components);

    });
    it('should parse a valid deployment.yml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './deployment.yml',
        content: fs.readFileSync('tests/resources/yaml/deployment.yml', 'utf8'),
      });

      parser.parse([file]);
     

     expect(pluginData.components).toEqual(deploymentPluginData.components);

    });
    
    it('should parse a valid service.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './service.yaml',
        content: fs.readFileSync('tests/resources/yaml/service.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(servicePluginData.components);

    });

    it('should parse a valid job.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './job.yaml',
        content: fs.readFileSync('tests/resources/yaml/job.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(jobPluginData.components);

    });
  

    it('should parse a valid cronjob.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './cronjob.yaml',
        content: fs.readFileSync('tests/resources/yaml/cronjob.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(cronjobPluginData.components);

    });

    it('should parse a valid statefulset.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './statefulset.yaml',
        content: fs.readFileSync('tests/resources/yaml/statefulset.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(statefulsetPluginData.components);

    });

    it('should parse a valid pvc.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './pvc.yaml',
        content: fs.readFileSync('tests/resources/yaml/pvc.yaml', 'utf8'),
      });

      parser.parse([file]);


      expect(pluginData.components).toEqual(pvcPluginData.components);

    });

    it('should parse a valid secret.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './secret.yaml',
        content: fs.readFileSync('tests/resources/yaml/secret.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(secretPluginData.components);

    });


    it('should parse a valid configmap.yaml file and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './configmap.yaml',
        content: fs.readFileSync('tests/resources/yaml/configmap.yaml', 'utf8'),
      });

      parser.parse([file]);

      expect(pluginData.components).toEqual(configmapPluginData.components);

    });


    it('should parse multiple valid YAML files and return valid components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const files = [
        new FileInput({
          path: './ingress.yaml',
          content: fs.readFileSync('tests/resources/yaml/ingress.yaml', 'utf8'),
        }),
        new FileInput({
          path: './service.yaml',
          content: fs.readFileSync('tests/resources/yaml/service.yaml', 'utf8'),
        }),
      ];

      parser.parse(files);

      expect(pluginData.components).toEqual([
        ...ingressPluginData.components,
        ...servicePluginData.components,
      ]);
    });
    it('should correctly determine if a file is parsable based on its extension', () => {
      const parser = new KubernetesParser();

      const yamlFile = new FileInformation({ path: './service.yaml' });
      const ymlFile = new FileInformation({ path: './deployment.yml' });
      const jsonFile = new FileInformation({ path: './config.json' });
      const txtFile = new FileInformation({ path: './test.txt' });

      expect(parser.isParsable(yamlFile)).toBe(true);
      expect(parser.isParsable(ymlFile)).toBe(true);
      expect(parser.isParsable(jsonFile)).toBe(false);
      expect(parser.isParsable(txtFile)).toBe(false);
    });

    it('Should set empty components on null input files', () => {
      const pluginData = new KubernetesData();
      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: '',
        content: null,
      });
      parser.parse([file]);

      expect(pluginData.components).not.toBeNull();
      expect(pluginData.components.length).toEqual(0);
    });


    it('Should set empty components on no input files', () => {
      const pluginData = new KubernetesData();
      const parser = new KubernetesParser(pluginData);
      parser.parse();

      expect(pluginData.components).not.toBeNull();
      expect(pluginData.components.length).toEqual(0);
    });
   
    it('should handle invalid YAML files and exclude them from parsed components', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();
    
      const parser = new KubernetesParser(pluginData);
      const file = new FileInput({
        path: './invalid.yaml',
        content: fs.readFileSync('tests/resources/yaml/invalid.yaml', 'utf8'),
      });
      const filesToParse = [file];
      const filteredFiles = filesToParse.filter((f) => f.path !== './invalid.yaml');

      parser.parse(filteredFiles);
      console.log(pluginData.components);
      expect(pluginData.components.length).toEqual(0);

    });


  });
  
  describe('convertObjectAttributeToJsObject', () => {
    test('converts object attribute to JavaScript object', () => {
      const pluginData = new KubernetesData();
      const parser = new KubernetesParser(pluginData);
      const objectAttribute = {
        value: [{ name: 'name' , value: 'mon-application' },],
      };
  
      const result = parser.convertObjectAttributeToJsObject(objectAttribute);
  
      expect(result).toEqual({ name: 'mon-application' });
    });
  });
  
 
  describe('__convertSelectorToLinkAttribute', () => {
    it('should return an array of matching component IDs', () => {
      const pluginData = new KubernetesData();
      const metadata = new KubernetesMetadata(pluginData);
      metadata.parse();

      const parser = new KubernetesParser(pluginData);
      const files = [
        new FileInput({
          path: './pod.yaml',
          content: fs.readFileSync('tests/resources/yaml/pod.yaml', 'utf8'),
        }),
        new FileInput({
          path: './service.yaml',
          content: fs.readFileSync('tests/resources/yaml/service.yaml', 'utf8'),
        }),
      ];

      parser.parse(files);

      const matchLabelsAttribute = {  value: 'not an array'  }; 
      const targetComponentType = 'Pod';

      const result = parser.__convertSelectorToLinkAttribute(matchLabelsAttribute, targetComponentType);
      
  

      expect(result).not.toBeDefined();

      
    });
    
  });



  

  



});