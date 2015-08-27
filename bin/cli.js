#! /usr/bin/env node
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _got = require('got');

var _got2 = _interopRequireDefault(_got);

var _homedir = require('homedir');

var _homedir2 = _interopRequireDefault(_homedir);

var _lib = require('./../lib/');

var _lib2 = _interopRequireDefault(_lib);

var _libMessages = require('./../lib/messages');

var messages = _interopRequireWildcard(_libMessages);

var rander = new _lib2['default']({ homeDir: _homedir2['default']() }, { messages: messages, request: _got2['default'] });

var cli = _meow2['default']({
  help: ['Usage', '  rander setup <transport> — for initial transport setup', '  rander <transport> params — runs transport with params']
});

var input = cli.input || [];
var command = input.shift();

if (command === 'setup') {
  var transportName = input.shift();

  rander.setup(transportName, input);
} else if (command === 'help') {
  rander.help(input.shift());
} else {
  rander.run(command, input);
}