#! /usr/bin/env node

import meow from 'meow';
import got from 'got';
import homedir from 'homedir';
import chalk from 'chalk';

import { isEmpty } from 'lodash';

import Ranco from './../lib/';
import * as messages from './../lib/messages';

const ranco = new Ranco({ homeDir: homedir() }, { messages, request: got, chalk });

const cli = meow({
  pkg: '../package.json',
  help: [
    'Usage',
    '  ranco setup <transport>   for initial transport setup',
    '  ranco <transport> params  runs transport with params and show random results',
    '  ranco help <transport>    shows help for transport',
    '  ranco --help              shows ranco help',
    '',
    'Options',
    '  -c  count of results [Default: 1]',
    ''
  ]
});

if (isEmpty(cli.input)) {
  console.log(cli.help);
} else {
  const input = cli.input || [];
  const flags = cli.flags || {};
  const command = input.shift();

  if (command === 'setup') {
    const transportName = input.shift();

    ranco.setup(transportName, input, flags);
  } else if (command === 'help') {
    ranco.help(input.shift(), flags);
  } else {
    ranco.run(command, input, flags);
  }
}
