'use strict';

var _dec, _class;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GroupBuilder = require('./Builders/GroupBuilder');
const CommandBuilder = require('./Builders/CommandBuilder');

const typeConf = {
  parse: []
};

let CommandManager = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('CommandManager', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('config', _flowRuntime2.default.any())), _flowRuntime2.default.method('group'), _flowRuntime2.default.method('command', _flowRuntime2.default.param('command', _flowRuntime2.default.string()), _flowRuntime2.default.param('handler', _flowRuntime2.default.function())), _flowRuntime2.default.method('register', _flowRuntime2.default.param('command', _flowRuntime2.default.any())), _flowRuntime2.default.method('push', _flowRuntime2.default.param('group', _flowRuntime2.default.any())), _flowRuntime2.default.method('pop'), _flowRuntime2.default.method('defaultPrefix'), _flowRuntime2.default.method('dispatch', _flowRuntime2.default.param('message', _flowRuntime2.default.any())))), _dec(_class = class CommandManager {

  constructor(config) {
    this._config = Object.assign({}, typeConf, config);
    this._commands = [];
    this._defaultPrefix = '/';
    this._groupStack = [];
  }

  group() {
    const group = new GroupBuilder(this, this.defaultPrefix);
    if (this._groupStack.length > 0) group.parent(this._groupStack[this._groupStack.length - 1]);
    return group;
  }

  command(command, handler) {
    let _commandType = _flowRuntime2.default.string();

    let _handlerType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('command', _commandType).assert(command);

    _flowRuntime2.default.param('handler', _handlerType).assert(handler);

    const builder = new CommandBuilder(this);
    let prefix = this._defaultPrefix;
    this._groupStack.forEach(group => {
      prefix = group.prefix || this._defaultPrefix;
      if (group.parent) builder.parent(group.parent);
      builder.middleware(group.middlewares);
    });
    return builder.prefix(prefix).command(command).handler(handler);
  }

  register(command) {
    this._commands.push(command);
  }

  push(group) {
    this._groupStack.push(group);
  }

  pop() {
    this._groupStack.pop();
  }

  get defaultPrefix() {
    return this._defaultPrefix;
  }

  dispatch(message) {
    const splitWithQuotes = text => text.match(new RegExp("[^\\s\"']+|\"([^\"]*)\"|'([^']*)'", 'g')).map(val => val.replace(/\"|\'/g, ''));
    const lines = splitWithQuotes(message.content);
    if (lines.length == 0) return;
    this._commands.forEach(cmd => {
      if (cmd.command === lines[0]) {
        cmd.call(this._config.parse, message, lines.splice(1));
        return true;
      }
    });
    return false;
  }

}) || _class);


module.exports = CommandManager;