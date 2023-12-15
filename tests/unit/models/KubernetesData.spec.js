import {
  Component,
  ComponentAttribute,
} from 'leto-modelizer-plugin-core';
import KubernetesData from 'src/models/KubernetesData';
import KubernetesComponentDefinition from 'src/models/KubernetesComponentDefinition';
import KubernetesComponentAttributeDefinition from 'src/models/KubernetesComponentAttributeDefinition';

describe('Test class: KubernetesData', () => {
  describe('Test method: addComponent', () => {
    it('Should create a component and add it to the components list', () => {
      const kubernetesData = new KubernetesData();
      const definition = new KubernetesComponentDefinition({ type: 'Pod' });
      const id = kubernetesData.addComponent(definition);

      expect(id).toBe('Pod_1');
      expect(kubernetesData.components).toStrictEqual([
        new Component({
          id,
          name: id,
          definition,
          path: `${id}.yaml`,
        }),
      ]);
    });

    it('Should create a component and set correct path with folder', () => {
      const kubernetesData = new KubernetesData();
      const definition = new KubernetesComponentDefinition({ type: 'Pod' });
      const id = kubernetesData.addComponent(definition, 'src');

      expect(id).toBe('Pod_1');
      expect(kubernetesData.components).toStrictEqual([
        new Component({
          id,
          name: id,
          definition,
          path: `src/${id}.yaml`,
        }),
      ]);
    });

    it('Should create a Container component with default attribute isInitContainer', () => {
      const kubernetesData = new KubernetesData();
      const definition = new KubernetesComponentDefinition({
        type: 'Container',
        definedAttributes: [
          new KubernetesComponentAttributeDefinition({
            name: 'isInitContainer',
            type: 'Boolean',
          }),
        ],
      });
      const id = kubernetesData.addComponent(definition);

      expect(id).toBe('Container_1');
      expect(kubernetesData.components).toStrictEqual([
        new Component({
          id,
          name: id,
          definition,
          path: `${id}.yaml`,
          attributes: [
            new ComponentAttribute({
              name: 'isInitContainer',
              value: false,
              type: 'Boolean',
              definition: definition.definedAttributes[0],
            }),
          ],
        }),
      ]);
    });
  });
});
