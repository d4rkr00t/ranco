import chai from 'chai';
import sinon from 'sinon';

const assert = chai.assert;

sinon.assert.expose(assert, { prefix: '' });

global.assert = assert;
global.sinon = sinon;
