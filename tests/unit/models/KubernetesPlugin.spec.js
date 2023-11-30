import KubernetesPlugin from 'src/models/KubernetesPlugin';

describe('Test class: KubernetesPlugin', () => {
  describe('Test constructor', () => {
    it('Check variable initialization', () => {
      const plugin = new KubernetesPlugin();

      expect(plugin.data).not.toBeNull();
      expect(plugin.__drawer).not.toBeNull();
      expect(plugin.__metadata).not.toBeNull();
      expect(plugin.__parser).not.toBeNull();
      expect(plugin.__renderer).not.toBeNull();
    });
  });
});
