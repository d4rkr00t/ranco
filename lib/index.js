'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs2 = require('fs');

var _fs3 = _interopRequireDefault(_fs2);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _lodash = require('lodash');

var CACHE = '.ranco_cache.json';

var Ranco = (function () {
  function Ranco() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var imports = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Ranco);

    this.options = options;

    this.messages = imports.messages;
    this.request = imports.request;
    this.require = imports.require || require;
    this.fs = imports.fs || _fs3['default'];
    this.path = imports.path || _path3['default'];
    this.execCmd = imports.execCmd || _child_process2['default'].exec;

    this.imports = imports;
    this.imports.random = _lodash.sample;

    this.setupPkgsPath(options.homeDir);

    this.config = this.loadConfig(options.homeDir);
  }

  Ranco.prototype.requirePlugin = function requirePlugin(transportName, debug) {
    var transportPath = this.path.join(this.pkgsPath, 'ranco-' + transportName);

    try {
      return this.require(transportPath);
    } catch (e) {
      this.messages.error('Module with transportName \'ranco-' + transportName + '\' is not installed, try run npm i -g ranco-' + transportName);

      if (debug) {
        console.error(e.stack);
      }
    }
  };

  Ranco.prototype.setup = function setup(transportName, args, flags) {
    var transport = this.requirePlugin(transportName, flags.debug);

    if (!transport) return;

    if (!transport.setup) {
      this.messages.error('Module \'ranco-' + transportName + '\' doesn\'t have setup handler');
      return;
    }

    transport.setup(args, flags, this.getTransportConfig(transportName), this.imports);
  };

  Ranco.prototype.run = function run(transportName, args, flags) {
    var transport = this.requirePlugin(transportName, flags.debug);

    if (!transport) return;

    if (!transport.run) {
      this.messages.error('Module \'ranco-' + transportName + '\' doesn\'t have run handler');
      return;
    }

    transport.run(args, flags, this.getTransportConfig(transportName), this.imports);
  };

  Ranco.prototype.help = function help(transportName, flags) {
    var transport = this.requirePlugin(transportName, flags.debug);

    if (!transport) return;

    if (!transport.help) {
      this.messages.error('Module \'ranco-' + transportName + '\' doesn\'t have help handler');
      return;
    }

    this.messages.help(transportName, transport.help());
  };

  Ranco.prototype.loadConfig = function loadConfig(homeDir) {
    if (!homeDir) return {};

    var fs = this.fs;

    var configPath = this.path.join(homeDir, '.rancorc');

    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath));
    }

    return {};
  };

  Ranco.prototype.setupPkgsPath = function setupPkgsPath(homeDir) {
    var _this = this;

    var cachePath = this.path.join(homeDir, CACHE);

    if (this.fs.existsSync(cachePath)) {
      this.pkgsPath = this.require(cachePath).pkgsPath;
    } else {
      this.execCmd('npm config get prefix', function (error, stdout) {
        var prefix = stdout.replace('\n', '').replace('\r', '');

        _this.pkgsPath = _this.path.join(prefix, 'lib', 'node_modules');

        _this.fs.writeFileSync(cachePath, '{ "pkgsPath": "' + _this.pkgsPath + '" }', { flag: 'w' });
      });
    }
  };

  Ranco.prototype.getTransportConfig = function getTransportConfig(transportName) {
    return this.config[transportName] || {};
  };

  return Ranco;
})();

exports['default'] = Ranco;
module.exports = exports['default'];