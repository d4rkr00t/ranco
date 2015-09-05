import Ranco from '../src/lib/';

describe('Ranco Class', () => {
  describe('#constructor', () => {
    it('should not throw when instantiating class', () => {
      assert.doesNotThrow(() => new Ranco());
    });
  });

  describe('#requirePlugin', () => {
    let ranco;
    beforeEach(() => {
      ranco = new Ranco({}, {
        messages: {},
        require(transportName) {
          return transportName;
        }
      });
    });

    it('should require plugin', () => {
      assert.equal(ranco.requirePlugin('transport'), 'ranco-transport');
    });

    it('should show error message if error was thrown while requiring plugin', done => {
      ranco.require = () => { throw new Error('error'); };

      ranco.messages.error = () => done();

      ranco.requirePlugin('transport');
    });
  });

  ['setup', 'run'].map(method => {
    describe(`#${method}`, () => {
      let ranco;
      beforeEach(() => {
        ranco = new Ranco();
      });

      it('should return nothing if there is no transport', () => {
        ranco.requirePlugin = () => null;

        assert.notOk(ranco[method]('transport', [], {}));
      });

      it(`should show error message if there is no method ${method} handler in transport`, done => {
        ranco.requirePlugin = () => { return {}; };
        ranco.messages = { error() { done(); } };
        ranco[method]('transport', [], {});
      });

      it(`should call ${method} method of tranpsort`, done => {
        ranco.requirePlugin = () => { return { [method]() { done(); } }; };
        ranco[method]('transport', [], {});
      });
    });

    describe('#help', () => {
      let ranco;
      beforeEach(() => {
        ranco = new Ranco();
      });

      it('should return nothing if there is no transport', () => {
        ranco.requirePlugin = () => null;

        assert.notOk(ranco.help('transport', [], {}));
      });

      it('should show error message if there is no method help handler in transport', done => {
        ranco.requirePlugin = () => { return {}; };
        ranco.messages = { error() { done(); } };
        ranco.help('transport', [], {});
      });

      it('should show help of tranpsort', done => {
        ranco.messages = { help() { done(); } };
        ranco.requirePlugin = () => { return { help() {} }; };
        ranco.help('transport', [], {});
      });
    });
  });
});
