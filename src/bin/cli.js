#! /usr/bin/env node

import meow from 'meow';
import got from 'got';
import homedir from 'homedir';

import Rander from './../lib/';
import * as messages from './../lib/messages';

const rander = new Rander({ homeDir: homedir() }, { messages, request: got });

const cli = meow({
  help: [
    'Usage',
    '  rander setup <transport> — for initial transport setup',
    '  rander <transport> params — runs transport with params'
  ]
});

const input = cli.input || [];
const command = input.shift();

if (command === 'setup') {
  const transportName = input.shift();

  rander.setup(transportName, input);
} else {
  rander.run(command, input);
}
