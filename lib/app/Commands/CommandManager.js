'use strict';

const GroupBuilder = require('./Builders/GroupBuilder');
const CommandBuilder = require('./Builders/CommandBuilder');

let CommandManager = class CommandManager {

  constructor(defaultPrefix = '/') {
    this._commands = [];
    this._defaultPrefix = defaultPrefix;
    this._groupStack = [];
  }

  group() {
    const group = new GroupBuilder(this, this.defaultPrefix);
    if (this._groupStack.length > 0) group.parent(this._groupStack[this._groupStack.length - 1]);
    return group;
  }

  command(command, handler) {
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

  onMessage(message) {
    const splitWithQuotes = text => text.match(new RegExp("[^\\s\"']+|\"([^\"]*)\"|'([^']*)'", 'g')).map(val => val.replace(/\"|\'/g, ''));
    const lines = splitWithQuotes(message.content);
    if (lines.length == 0) return;
    this._commands.forEach(cmd => {
      if (cmd.command === lines[0]) cmd.call(message, lines.splice(1));
    });
  }

};


module.exports = CommandManager;