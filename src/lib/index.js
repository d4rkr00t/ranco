import _fs from 'fs';
import _path from 'path';
import childProcess from 'child_process';
import { sample } from 'lodash';

const CACHE = '.ranco_cache.json';

class Ranco {
  constructor(options = {}, imports = {}) {
    this.options = options;

    this.messages = imports.messages;
    this.request = imports.request;
    this.require = imports.require || require;
    this.fs = imports.fs || _fs;
    this.path = imports.path || _path;
    this.execCmd = imports.execCmd || childProcess.exec;

    this.imports = imports;
    this.imports.random = sample;

    this.setupPkgsPath(options.homeDir);

    this.config = this.loadConfig(options.homeDir);
  }

  requirePlugin(transportName, debug) {
    const transportPath = this.path.join(this.pkgsPath, `ranco-${transportName}`);

    try {
      return this.require(transportPath);
    } catch (e) {
      this.messages.error(`Module with transportName 'ranco-${transportName}' is not installed, try run npm i -g ranco-${transportName}`);

      if (debug) {
        console.error(e.stack);
      }
    }
  }

  setup(transportName, args, flags) {
    const transport = this.requirePlugin(transportName, flags.debug);

    if (!transport) return;

    if (!transport.setup) {
      this.messages.error(`Module 'ranco-${transportName}' doesn't have setup handler`);
      return;
    }

    transport.setup(args, flags, this.getTransportConfig(transportName), this.imports);
  }

  run(transportName, args, flags) {
    const transport = this.requirePlugin(transportName, flags.debug);

    if (!transport) return;

    if (!transport.run) {
      this.messages.error(`Module 'ranco-${transportName}' doesn't have run handler`);
      return;
    }

    transport.run(args, flags, this.getTransportConfig(transportName), this.imports);
  }

  help(transportName, flags) {
    const transport = this.requirePlugin(transportName, flags.debug);

    if (!transport) return;

    if (!transport.help) {
      this.messages.error(`Module 'ranco-${transportName}' doesn't have help handler`);
      return;
    }

    this.messages.help(transportName, transport.help());
  }

  loadConfig(homeDir) {
    if (!homeDir) return {};

    const fs = this.fs;

    const configPath = this.path.join(homeDir, '.rancorc');

    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath));
    }

    return {};
  }

  setupPkgsPath(homeDir) {
    const cachePath = this.path.join(homeDir, CACHE);

    if (this.fs.existsSync(cachePath)) {
      this.pkgsPath = this.require(cachePath).pkgsPath;
    } else {
      this.execCmd('npm config get prefix', (error, stdout) => {
        const prefix = stdout.replace('\n', '').replace('\r', '');

        this.pkgsPath = this.path.join(prefix, 'lib', 'node_modules');

        this.fs.writeFileSync(cachePath, `{ "pkgsPath": "${this.pkgsPath}" }`, { flag: 'w' });
      });
    }
  }

  getTransportConfig(transportName) {
    return this.config[transportName] || {};
  }
}

export default Ranco;
