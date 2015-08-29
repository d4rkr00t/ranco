import Rander from '../src/lib/';

describe('Rander Class', () => {
  describe('#constructor', () => {
    it('should not throw when instantiating class', () => {
      assert.doesNotThrow(() => new Rander());
    });
  });
});
