import KubernetesPlugin from 'src/index';

describe('Test index of project', () => {
  it('Index should export KubernetesPlugin', () => {
    expect(new KubernetesPlugin().constructor.name).toBe('KubernetesPlugin');
  });
});
