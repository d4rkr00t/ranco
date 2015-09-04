import Rander from '../src/lib/';

describe('Rander Class', () => {
  describe('#constructor', () => {
    it('should not throw when instantiating class', () => {
      assert.doesNotThrow(() => new Rander());
    });
  });

  describe('#requirePlugin', () => {
    let rander;
    beforeEach(() => {
      rander = new Rander({}, {
        messages: {},
        require(transportName) {
          return transportName;
        }
      });
    });

    it('should require plugin', () => {
      assert.equal(rander.requirePlugin('transport'), 'rander-transport');
    });

    it('should show error message if error was thrown while requiring plugin', done => {
      rander.require = () => { throw new Error('error'); };

      rander.messages.error = () => done();

      rander.requirePlugin('transport');
    });
  });

  ['setup', 'run'].map(method => {
    describe(`#${method}`, () => {
      let rander;
      beforeEach(() => {
        rander = new Rander();
      });

      it('should return nothing if there is no transport', () => {
        rander.requirePlugin = () => null;

        assert.notOk(rander[method]('transport', [], {}));
      });

      it(`should show error message if there is no method ${method} handler in transport`, done => {
        rander.requirePlugin = () => { return {}; };
        rander.messages = { error() { done(); } };
        rander[method]('transport', [], {});
      });

      it(`should call ${method} method of tranpsort`, done => {
        rander.requirePlugin = () => { return { [method]() { done(); } }; };
        rander[method]('transport', [], {});
      });
    });

    describe('#help', () => {
      let rander;
      beforeEach(() => {
        rander = new Rander();
      });

      it('should return nothing if there is no transport', () => {
        rander.requirePlugin = () => null;

        assert.notOk(rander.help('transport', [], {}));
      });

      it('should show error message if there is no method help handler in transport', done => {
        rander.requirePlugin = () => { return {}; };
        rander.messages = { error() { done(); } };
        rander.help('transport', [], {});
      });

      it('should show help of tranpsort', done => {
        rander.messages = { help() { done(); } };
        rander.requirePlugin = () => { return { help() {} }; };
        rander.help('transport', [], {});
      });
    });
  });
});
