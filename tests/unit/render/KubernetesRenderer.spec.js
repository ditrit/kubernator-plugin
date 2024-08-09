import KubernetesData from 'src/models/KubernetesData';
import KubernetesRenderer from 'src/render/KubernetesRenderer';

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

import noLabelsComponents from 'tests/resources/js/advanced/no_labels';
import emptyLinkSelectorComponents from 'tests/resources/js/advanced/empty_link_selector';
import wrongLinkSelectorComponents from 'tests/resources/js/advanced/wrong_link_selector';
import noSpecComponents from 'tests/resources/js/advanced/no_spec';

import { FileInput } from '@ditrit/leto-modelizer-plugin-core';
import fs from 'fs';
import yaml from 'js-yaml';

describe('Test class: KubernetesRenderer', () => {
  describe('Test method: renderFiles', () => {
    /**
     * Render components into Kubernetes files.
     * @param {Component[]} components - Components to render.
     * @returns {FileInput[]} Rendered file.
     */
    function renderFiles(components) {
      const pluginData = new KubernetesData();
      const renderer = new KubernetesRenderer(pluginData);
      pluginData.components = components;
      return renderer.renderFiles();
    }

    it('Should render simple components and return expected files', () => {
      expect(renderFiles([
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
      ])).toStrictEqual([
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
    });

    it('Should add labels to components without labels', () => {
      expect(yaml.load(renderFiles(noLabelsComponents)[0].content).metadata.labels)
        .toStrictEqual({ 'app.kubernetes.io/name': 'pod' });
    });

    it('Should create an empty selector object if a selector Link attribute is empty', () => {
      expect(yaml.load(renderFiles(emptyLinkSelectorComponents)[0].content).spec.selector)
        .toStrictEqual({});
    });

    it('Should throw an error if the component referenced by a selector Link attribute does not exist', () => {
      expect(() => renderFiles(wrongLinkSelectorComponents))
        .toThrow(new Error("Target component not found 'this_is_a_wrong_id'."));
    });

    it('Should add default labels to the selector if the component referenced by a selector Link attribute does not have labels', () => {
      expect(yaml.load(renderFiles([
        ...serviceComponents,
        ...noLabelsComponents,
      ])[0].content).spec.selector).toStrictEqual({ 'app.kubernetes.io/name': 'pod' });
    });

    it('Should not render a child template if a parent has no children', () => {
      expect(yaml.load(renderFiles(noSpecComponents)[0].content).spec?.template).not.toBeDefined();
    });
  });
});
