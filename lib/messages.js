'use strict';

exports.__esModule = true;
exports.error = error;
exports.warning = warning;
exports.info = info;
exports.success = success;
exports.notice = notice;
exports.results = results;
exports.help = help;
exports.commandNotFound = commandNotFound;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

var _lodash = require('lodash');

function error(msg) {
  console.log(_chalk2['default'].red('[ERROR] ') + msg);
}

function warning(msg) {
  console.log(_chalk2['default'].yellow('[WARNING] ') + msg);
}

function info(msg) {
  console.log(_chalk2['default'].magenta('[INFO] ') + msg);
}

function success(msg) {
  console.log(_chalk2['default'].green(msg));
}

function notice(msg) {
  console.log(_chalk2['default'].cyan(msg));
}

function results(result) {
  console.log('');

  if (_lodash.isArray(result)) {
    result.map(function (row) {
      return console.log(_indentString2['default'](row, ' ', 2));
    });
  } else {
    console.log(_indentString2['default'](result, ' ', 2));
  }

  console.log('');
}

function help(transportName, helpMsg) {
  var rowMsgStart = 'rander ' + transportName;

  console.log('');
  console.log(_indentString2['default']('Usage for ' + transportName + ':', ' ', 2));

  if (_lodash.isArray(helpMsg)) {
    helpMsg.map(function (row) {
      return console.log(_indentString2['default'](rowMsgStart + ' ' + row, ' ', 4));
    });
  } else {
    console.log(_indentString2['default'](rowMsgStart + ' ' + helpMsg, ' ', 4));
  }

  console.log('');
}

function commandNotFound(transportName, command) {
  error('Command ' + command + ' not found in ' + transportName + ' transport.');
}