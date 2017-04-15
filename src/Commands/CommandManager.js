const GroupBuilder = require('./Builders/GroupBuilder');
const CommandBuilder = require('./Builders/CommandBuilder');

const typeConf = {
  parse: []
};

class CommandManager {

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

  command(command: string, handler: Function) {
    const builder = new CommandBuilder(this);
    let prefix = this._defaultPrefix;
    this._groupStack.forEach(group => {
      prefix = group.prefix || this._defaultPrefix;
      if (group.parent) builder.parent(group.parent)
      builder.middleware(group.middlewares);
    });
    return builder.prefix(prefix).command(command).handler(handler);
  }

  register(command) {
    this._commands.push(command)
  }

  push(group) {
    this._groupStack.push(group)
  }

  pop() {
    this._groupStack.pop()
  }

  get defaultPrefix() {
    return this._defaultPrefix
  }

  dispatch(message) {
    const splitWithQuotes = text => text.match(new RegExp("[^\\s\"']+|\"([^\"]*)\"|'([^']*)'", 'g')).map(val => val.replace(/\"|\'/g, ''));
    if(!message.content) return false;
    const lines = splitWithQuotes(message.content);
    if (lines.length == 0) return;
    let called = false;
    this._commands.forEach(cmd => {
      if (cmd.command === lines[0]) {
        cmd.call(this._config.parse, message, lines.splice(1));
        called = true;
      }
    });
    return called;
  }

}

module.exports = CommandManager;