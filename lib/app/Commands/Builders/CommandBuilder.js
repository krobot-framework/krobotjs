'use strict';

const Command = require('../Command');

let CommandBuilder = class CommandBuilder {

  constructor(commandManager) {
    this._commandManager = commandManager;
    this._prefix = '';
    this._middlewares = [];
    this._command = '';
    this._args = [];
    this._parent = null;
    this._handler = null;
  }

  parent(parent) {
    this._parent = parent;
    return this;
  }

  middleware(middleware) {
    if (typeof middleware === 'function') this._middlewares.push(middleware);else if (middleware instanceof Array) this._middlewares = this._middlewares.concat(middleware);else throw new Error('must be a function or an array of function');
    return this;
  }

  prefix(prefix) {
    if (!this._parent || this.parent && !this._parent.prefix) this._prefix = prefix;
    return this;
  }

  command(cmd) {
    const split = cmd.split(' ');
    this._command = split.shift();
    split.forEach(arg => {
      let optional = false;
      let list = false;
      let regex = new RegExp('', 'g');

      if (arg === '*') arg = '[dynamic...]';
      if (arg[0] === '[') optional = true;

      arg = arg.slice(1, arg.length - 1);

      if (arg.includes(':')) [arg, regex] = arg.split(':');
      regex = new RegExp(regex, 'g');

      if (arg.endsWith('...')) [list, arg] = [true, arg.replace('...')];

      this._args.push({
        key: arg,
        optional,
        list,
        regex
      });
    });
    return this;
  }

  handler(handler) {
    if (typeof handler !== 'function') throw new Error('the handler must be a function');
    this._handler = handler;
    return this;
  }

  build() {
    return new Command(this._prefix + this._command, this._args, this._middlewares, this._handler);
  }

  register() {
    const cmd = this.build();
    if (this._parent) this._parent.sub(cmd);else this._commandManager.register(cmd);
    return cmd;
  }

};


module.exports = CommandBuilder;