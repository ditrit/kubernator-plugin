import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';

describe('Test class: KubernetesComponentDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation without any parameters in constructor', () => {
      const definition = new KubernetesComponentDefinition();
      expect(definition.apiVersion).toBeNull();
      expect(definition.childrenIndex).toStrictEqual([]);
      expect(definition.ignoredAttributes).toStrictEqual([]);
    });

    it('Check passing empty object to constructor', () => {
      const definition = new KubernetesComponentDefinition({});
      expect(definition.apiVersion).toBeNull();
      expect(definition.childrenIndex).toStrictEqual([]);
      expect(definition.ignoredAttributes).toStrictEqual([]);
    });

    it('Check passing props to constructor', () => {
      const definition = new KubernetesComponentDefinition({
        apiVersion: 'v1',
        childrenIndex: [{
          attributeName: 'template',
          componentType: 'Pod',
        }],
        ignoredAttributes: ['apiVersion', 'kind', 'status'],
      });
      expect(definition.apiVersion).toBe('v1');
      expect(definition.childrenIndex).toStrictEqual([{
        attributeName: 'template',
        componentType: 'Pod',
      }]);
      expect(definition.ignoredAttributes).toStrictEqual(['apiVersion', 'kind', 'status']);
    });
  });
});
