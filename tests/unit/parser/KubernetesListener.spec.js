import KubernetesListener from 'src/parser/KubernetesListener';




describe('Test KubernatorParser', () => {
    describe('Test functions', () => {
      describe('Test function: lidyToLetoType', () => {
        it('Should return true on .yaml file', () => {
          const listener = new KubernetesListener();
          expect(listener.lidyToLetoType('string')).toBe('String');
          expect(listener.lidyToLetoType('boolean')).toBe('Boolean');
          expect(listener.lidyToLetoType('int')).toBe('Number');
          expect(listener.lidyToLetoType('float')).toBe('Number');
          expect(listener.lidyToLetoType('map')).toBe('Object');
          expect(listener.lidyToLetoType('list')).toBe('Array');
          expect(listener.lidyToLetoType('something else')).toBe(null);
        });
      }); 
      
    });

    
      
});
