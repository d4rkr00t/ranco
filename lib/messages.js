'use strict';

exports.__esModule = true;
exports.result = result;
exports.error = error;
exports.warning = warning;
exports.info = info;
exports.success = success;
exports.notice = notice;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function result(title, url) {
  console.log(_chalk2['default'].blue('>') + ' ' + title + ' — [ ' + _chalk2['default'].yellow(url) + ' ]');
}

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
  console.log(_chalk2['default'].yellow(msg));
}

function notice(msg) {
  console.log(_chalk2['default'].cyan(msg));
}