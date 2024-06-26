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

    it('Check non container attribute value', () => {
      const componentDefinition = new KubernetesComponentDefinition({
        apiVersion: 'v1',
        childrenIndex: [{
          attributeName: 'template',
          componentType: 'Pod',
        }],
        ignoredAttributes: ['apiVersion', 'kind', 'status'],
        isContainer: false,
      });

      expect(componentDefinition.defaultWidth).toEqual(96);
      expect(componentDefinition.defaultHeight).toEqual(80);
      expect(componentDefinition.minWidth).toEqual(96);
      expect(componentDefinition.minHeight).toEqual(80);
      expect(componentDefinition.reservedWidth).toEqual(0);
      expect(componentDefinition.reservedHeight).toEqual(0);
    });

    it('Check container attribute value', () => {
      const componentDefinition = new KubernetesComponentDefinition({
        apiVersion: 'v1',
        childrenIndex: [{
          attributeName: 'template',
          componentType: 'Pod',
        }],
        ignoredAttributes: ['apiVersion', 'kind', 'status'],
        isContainer: true,
      });

      expect(componentDefinition.defaultWidth).toEqual(186);
      expect(componentDefinition.defaultHeight).toEqual(160);
      expect(componentDefinition.minWidth).toEqual(186);
      expect(componentDefinition.minHeight).toEqual(140);
      expect(componentDefinition.reservedWidth).toEqual(12);
      expect(componentDefinition.reservedHeight).toEqual(80);
    });
  });
});
