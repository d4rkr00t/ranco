#! /usr/bin/env node

import meow from 'meow';
import got from 'got';
import homedir from 'homedir';
import chalk from 'chalk';

import { isEmpty } from 'lodash';

import Rander from './../lib/';
import * as messages from './../lib/messages';

const rander = new Rander({ homeDir: homedir() }, { messages, request: got, chalk });

const cli = meow({
  pkg: '../package.json',
  help: [
    'Usage',
    '  rander setup <transport>   for initial transport setup',
    '  rander <transport> params  runs transport with params and show random results',
    '  rander help <transport>    shows help for transport',
    '  rander --help              shows rander help',
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

    rander.setup(transportName, input, flags);
  } else if (command === 'help') {
    rander.help(input.shift(), flags);
  } else {
    rander.run(command, input, flags);
  }
}
