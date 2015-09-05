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
        require(transportName) {
          return transportName;
        }
      });
    });

    it('should require plugin', () => {
      assert.equal(ranco.requirePlugin('transport'), 'ranco-transport');
    });

    it('should show error message if error was thrown while requiring plugin', () => {
      ranco.require = () => { throw new Error('error'); };
      ranco.messages = { error: sinon.stub() };

      ranco.requirePlugin('transport');

      assert.called(ranco.messages.error);
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

      it(`should show error message if there is no method ${method} handler in transport`, () => {
        ranco.requirePlugin = () => { return {}; };
        ranco.messages = { error: sinon.stub() };
        ranco[method]('transport', [], {});

        assert.called(ranco.messages.error);
      });

      it(`should call ${method} method of tranpsort`, () => {
        const methodStub = sinon.stub();
        ranco.requirePlugin = () => { return { [method]: methodStub }; };
        ranco[method]('transport', [], {});

        assert.called(methodStub);
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

      it('should show error message if there is no method help handler in transport', () => {
        ranco.requirePlugin = () => { return {}; };
        ranco.messages = { error: sinon.stub() };
        ranco.help('transport', [], {});

        assert.called(ranco.messages.error);
      });

      it('should show help of tranpsort', () => {
        const methodStub = sinon.stub();
        ranco.messages = { help: methodStub };
        ranco.requirePlugin = () => { return { help() {} }; };
        ranco.help('transport', [], {});

        assert.called(methodStub);
      });
    });
  });
});
