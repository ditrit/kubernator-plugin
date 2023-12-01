import KubernetesPlugin from 'src/models/KubernetesPlugin';
import KubernetesConfiguration from 'src/models/KubernetesConfiguration';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesDrawer from 'src/draw/KubernetesDrawer';
import KubernetesMetadata from 'src/metadata/KubernetesMetadata';
import KubernetesParser from 'src/parser/KubernetesParser';
import KubernetesRenderer from 'src/render/KubernetesRenderer';

describe('Test class: KubernetesPlugin', () => {
  describe('Test constructor', () => {
    it('Check variable initialization', () => {
      const plugin = new KubernetesPlugin();
      expect(plugin.configuration).toBeInstanceOf(KubernetesConfiguration);
      expect(plugin.data).toBeInstanceOf(KubernetesData);
      expect(plugin.__drawer).toBeInstanceOf(KubernetesDrawer);
      expect(plugin.__metadata).toBeInstanceOf(KubernetesMetadata);
      expect(plugin.__parser).toBeInstanceOf(KubernetesParser);
      expect(plugin.__renderer).toBeInstanceOf(KubernetesRenderer);
    });
  });
});
