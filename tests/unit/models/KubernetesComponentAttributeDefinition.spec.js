import KubernetesComponentAttributeDefinition from 'src/models/KubernetesComponentAttributeDefinition';

describe('Test class: KubernetesComponentAttributeDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation without any parameters in constructor', () => {
      const definition = new KubernetesComponentAttributeDefinition();
      expect(definition.ignoredAttributes).toStrictEqual([]);
    });

    it('Check passing empty object to constructor', () => {
      const definition = new KubernetesComponentAttributeDefinition({});
      expect(definition.ignoredAttributes).toStrictEqual([]);
    });

    it('Check passing props to constructor', () => {
      const definition = new KubernetesComponentAttributeDefinition({
        ignoredAttributes: ['selector'],
      });
      expect(definition.ignoredAttributes).toStrictEqual(['selector']);
    });
  });
});
