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

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lib = require('./../lib/');

var _lib2 = _interopRequireDefault(_lib);

var _libMessages = require('./../lib/messages');

var messages = _interopRequireWildcard(_libMessages);

var ranco = new _lib2['default']({ homeDir: _homedir2['default']() }, { messages: messages, request: _got2['default'], chalk: _chalk2['default'] });

var cli = _meow2['default']({
  pkg: '../package.json',
  help: ['Usage', '  ranco setup <transport>   for initial transport setup', '  ranco <transport> params  runs transport with params and show random results', '  ranco help <transport>    shows help for transport', '  ranco --help              shows ranco help', '', 'Options', '  -c  count of results [Default: 1]', '']
});

if (_lodash.isEmpty(cli.input)) {
  console.log(cli.help);
} else {
  var input = cli.input || [];
  var flags = cli.flags || {};
  var command = input.shift();

  if (command === 'setup') {
    var transportName = input.shift();

    ranco.setup(transportName, input, flags);
  } else if (command === 'help') {
    ranco.help(input.shift(), flags);
  } else {
    ranco.run(command, input, flags);
  }
}