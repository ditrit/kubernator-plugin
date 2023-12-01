import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';

describe('Test class: KubernetescComponentDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation without any parameters in constructor', () => {
      const definition = new KubernetesComponentDefinition();
      expect(definition.apiVersion).toBeNull();
    });

    it('Check passing empty object to constructor', () => {
      const definition = new KubernetesComponentDefinition({});
      expect(definition.apiVersion).toBeNull();
    });

    it('Check passing props to constructor', () => {
      const definition = new KubernetesComponentDefinition({
        apiVersion: 'v1',
      });
      expect(definition.apiVersion).toEqual('v1');
    });
  });
});
