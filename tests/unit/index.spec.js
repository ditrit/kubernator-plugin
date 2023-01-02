import Plugin from 'src/index';

describe('Test index of project', () => {
  it('Index should return KubernetesPlugin', () => {
    expect(new Plugin().constructor.name).toEqual('KubernetesPlugin');
  });
});
