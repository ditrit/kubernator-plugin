import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';

describe('Test class: KubernetesComponentDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation without any parameters in constructor', () => {
      const component = new KubernetesComponentDefinition();

      expect(component.apiVersion).toEqual("v1");
    });

   

  });
});
