import KubernetesRenderer from 'src/render/KubernetesRenderer';
import configMap from 'tests/resources/yaml/configmap';
import deploy from 'tests/resources/yaml/deployment_test';
import service from 'tests/resources/yaml/service';
import pod from 'tests/resources/yaml/pod';
import cronjob from 'tests/resources/yaml/cronjob';
import pvc from 'tests/resources/yaml/pvc';
import secret from 'tests/resources/yaml/secret';
import { DefaultData} from 'leto-modelizer-plugin-core';



describe('KubernetesRenderer', () => {
  let rendererDep;
  let rendrerService;
  let renderPod;
  let renderCronJob ;
  let renderconfigMap ;
  let renderpvc ;
  let rendersecret ;
  let render;
  let render1;
  beforeEach(() => {
    rendererDep = new KubernetesRenderer(deploy);
    rendrerService = new KubernetesRenderer(service);
    renderPod = new KubernetesRenderer(pod);
    renderCronJob = new KubernetesRenderer(cronjob);
    renderconfigMap = new KubernetesRenderer(configMap);
    renderpvc = new KubernetesRenderer(pvc);
    rendersecret = new KubernetesRenderer(secret);
    const pluginData = new DefaultData();
    render = new KubernetesRenderer(pluginData);
    render1 = new KubernetesRenderer();
  });


  it('should render deployment files correctly', () => {
    const files = rendererDep.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./deployment_test.yaml');
    expect(files).toBeDefined();
    // Add more assertions for the file content if needed
  });

  it('should render service files correctly', () => {
    const files = rendrerService.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./service.yaml');
    expect(files).toBeDefined();
  });

  it('should render pod files correctly', () => {
    const files = renderPod.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./pod.yaml');
    // Add more assertions for the file content if needed
  });
  it('should render cronJob files correctly', () => {
    const files = renderCronJob.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./cronjob.yaml');
    // Add more assertions for the file content if needed
  });

  it('should render configMap files correctly', () => {
    const files = renderconfigMap.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./configmap.yaml');
    // Add more assertions for the file content if needed
  });

  it('should render pvc files correctly', () => {
    const files = renderpvc.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./pvc.yaml');
    // Add more assertions for the file content if needed
  });
  it('should render secret files correctly', () => {
    const files = rendersecret.renderFiles();
    // Assert the number of rendered files
    expect(files.length).toBe(1);
    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./secret.yaml');
    // Add more assertions for the file content if needed
  });

  it('should format a deployment kubernetes component correctly', () => {
    const component = deploy.components.find(
      (comp) => comp.id === 'nginx',
    );

    const formattedComponent = rendererDep.formatComponent(component);
    // Add assertions to validate the formatted k8s component
   expect(formattedComponent.apiVersion).toBe('apps/v1');

  });


    it('should throw error for unknown selector formatSelectorLinkAttribute', () => {
      const attribute = {
        name: 'selector',
        value: ['component2'],
        type: 'Link',
      };
      const component = {
        id: 'component1',
        definition: {
          type: 'Unknown',
        },
      };
      expect(() => render.formatSelectorLinkAttribute(attribute, component)).toThrow(
        "Unknown selector in component 'component1'."
      );
    });
  

   describe('__formatSelectorLinkAttribute', () => {
    it('should format selector link attribute for Service', () => {
      const attribute = {
        name: 'selector',
        value: ['service'],
        type: 'Link',
      };
      render1.pluginData = {
        getComponentById: jest.fn(() => ({
          id: 'service',
          attributes: [
            {
              name: 'metadata',
              value: [
                {
                  name: 'labels',
                  value: [
                    {
                      name: 'app.kubernetes.io/name',
                      value: 'service',
                    },
                  ],
                },
              ],
            },
          ],
        })),
      };
      const formatted = render1.__formatSelectorLinkAttribute(attribute);
      expect(formatted).toEqual({
        "app.kubernetes.io/name": "service"
      });
      expect(render1.pluginData.getComponentById).toHaveBeenCalledWith('service');
    });
    it('should format selector link attribute for Service in case empty or undefined', () => {
      const attribute = {
        name: 'selector',
        value: ['service'],
        type: 'Link',
      };
      render1.pluginData = {
        getComponentById: jest.fn(() => ({
          id: 'service',
          attributes: [
            {
              name: 'metadata',
              value: [
                {},
              ],
            },
          ],
        })),
      };
      const formatted = render1.__formatSelectorLinkAttribute(attribute);
      expect(formatted).toEqual({"app.kubernetes.io/name": "service"});
    });
     it('should call __formatSelectorLinkAttribute for service to test ligne 87', () => {
       const attribute = {
         value: ['targetComponentId'],
       };
       const component = {
         definition: {
           type: 'Service',
         },
         id: 'componentId',
       };
       render1.__formatSelectorLinkAttribute = jest.fn();

       render1.formatSelectorLinkAttribute(attribute, component);

       expect(render1.__formatSelectorLinkAttribute).toHaveBeenCalledWith(attribute);
     });
    it('should throw error for unknown selector __formatSelectorLinkAttribute', () => {
      const attribute = {
        name: 'selector',
        value: ['component2'],
        type: 'Link',
      };
      render1.pluginData = {
        getComponentById: jest.fn(() => null),
      };
      expect(() => render1.__formatSelectorLinkAttribute(attribute)).toThrow(
        "Target component not found 'component2'."
      );
    });

  }); 
   
 });