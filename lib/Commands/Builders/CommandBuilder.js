'use strict';

var _dec, _class;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Command = require('../Command');

let CommandBuilder = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('CommandBuilder', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('commandManager', _flowRuntime2.default.any())), _flowRuntime2.default.method('parent', _flowRuntime2.default.param('parent', _flowRuntime2.default.any())), _flowRuntime2.default.method('middleware', _flowRuntime2.default.param('middleware', _flowRuntime2.default.union(_flowRuntime2.default.function(), _flowRuntime2.default.array(_flowRuntime2.default.function())))), _flowRuntime2.default.method('prefix', _flowRuntime2.default.param('prefix', _flowRuntime2.default.string())), _flowRuntime2.default.method('command', _flowRuntime2.default.param('cmd', _flowRuntime2.default.string())), _flowRuntime2.default.method('handler', _flowRuntime2.default.param('handler', _flowRuntime2.default.function())), _flowRuntime2.default.method('build'), _flowRuntime2.default.method('register'))), _dec(_class = class CommandBuilder {

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
    let _middlewareType = _flowRuntime2.default.union(_flowRuntime2.default.function(), _flowRuntime2.default.array(_flowRuntime2.default.function()));

    _flowRuntime2.default.param('middleware', _middlewareType).assert(middleware);

    if (typeof middleware === 'function') this._middlewares.push(middleware);else if (middleware instanceof Array) this._middlewares = this._middlewares.concat(middleware);
    return this;
  }

  prefix(prefix) {
    let _prefixType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('prefix', _prefixType).assert(prefix);

    if (!this._parent || this.parent && !this._parent.prefix) this._prefix = prefix;
    return this;
  }

  command(cmd) {
    let _cmdType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('cmd', _cmdType).assert(cmd);

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

      if (arg.endsWith('...')) [list, arg] = [true, arg.replace('...', '')];

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
    let _handlerType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('handler', _handlerType).assert(handler);

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

}) || _class);


module.exports = CommandBuilder;