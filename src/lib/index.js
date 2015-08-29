import fs from 'fs';
import path from 'path';
import { sample } from 'lodash';

class Rander {
  constructor(options = {}, imports = {}) {
    this.options = options;

    this.messages = imports.messages;
    this.request = imports.request;

    this.imports = imports;
    this.imports.random = sample;

    this.config = this.loadConfig(options.homeDir);
  }

  requirePlugin(transportName) {
    try {
      return require(`rander-${transportName}`);
    } catch (e) {
      this.messages.error(`Module with transportName 'rander-${transportName}' is not installed, try run npm i -g rander-${transportName}`);
    }
  }

  setup(transportName, args, flags) {
    const transport = this.requirePlugin(transportName);

    if (!transport) return;

    if (!transport.setup) {
      this.messages.error(`Module 'rander-${transportName}' doesn't have setup handler`);
      return;
    }

    transport.setup(args, flags, this.getTransportConfig(transportName), this.imports);
  }

  run(transportName, args, flags) {
    const transport = this.requirePlugin(transportName);

    if (!transport) return;

    if (!transport.run) {
      this.messages.error(`Module 'rander-${transportName}' doesn't have run handler`);
      return;
    }

    transport.run(args, flags, this.getTransportConfig(transportName), this.imports);
  }

  help(transportName) {
    const transport = this.requirePlugin(transportName);

    if (!transport) return;

    if (!transport.help) {
      this.messages.error(`Module 'rander-${transportName}' doesn't have help handler`);
      return;
    }

    this.messages.help(transportName, transport.help());
  }

  loadConfig(homeDir) {
    const configPath = path.join(homeDir, '.randerrc');

    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath));
    }

    return {};
  }

  getTransportConfig(transportName) {
    return this.config[transportName] || {};
  }
}

export default Rander;
