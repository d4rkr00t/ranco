import fs from 'fs';
import path from 'path';

class Rander {
  constructor(options = {}, imports) {
    this.options = options;
    this.imports = imports;
    this.messages = imports.messages;
    this.request = imports.request;

    this.config = this.loadConfig(options.homeDir);
  }

  requirePlugin(transportName) {
    try {
      return require(`rander-${transportName}`);
    } catch (e) {
      this.messages.error(`Module with transportName 'rander-${transportName}' is not installed, try run npm i -g rander-${transportName}`);
    }
  }

  setup(transportName, params) {
    const transport = this.requirePlugin(transportName);

    if (!transport) return;

    if (!transport.setup) {
      this.messages.error(`Module 'rander-${transportName}' doesn't have setup handler`);
      return;
    }

    transport.setup(params, this.getTransportConfig(transportName), this.imports);
  }

  run(transportName, params) {
    const transport = this.requirePlugin(transportName);

    if (!transport) return;

    if (!transport.run) {
      this.messages.error(`Module 'rander-${transportName}' doesn't have run handler`);
      return;
    }

    transport.run(params, this.getTransportConfig(transportName), this.imports);
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
