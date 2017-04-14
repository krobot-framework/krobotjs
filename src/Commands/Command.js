class Command {

  constructor(command, args, middlewares, handler) {
    this._command = command;
    this._args = args;
    this._middlewares = middlewares;
    this._handler = handler;
    this._subs = [];
  }

  async call(parser, message, args) {
    let subCalled = false;
    if (args.length > 0) {
      this._subs.forEach(sub => {
        if (sub.command === args[0]) {
          if (this.callMiddlewares(message)) {
            sub.call(message, args.slice(1));
            subCalled = true;
          }
          return;
        }
      });
    }
    if (!subCalled) {
      const map = new Map();
      for (let i = 0; i < this._args.length; i++) {
        let argument = args[i];

        if (!this._args[i].optional && !argument) return;

        if (this._args[i].list) {
          argument = args.splice(i)
          let match = true;
          argument.every(val => {
            if (this._args[i].regex.test(val)) return true;
            else return match = false;
          });
          if (!match) return;
        } else {
          const test = this._args[i].regex.test(argument);
          if (!test) return;
          if (i + 1 === this._args.length && i + 1 < args.length)
            return;
        }

        if (parser && parser instanceof Array)
          for (let i = 0; i < parser.length; i++) {
            const parse = parser[i];
            let cond = false;
            if (parse.match instanceof RegExp)
              cond = parse.match.test(argument)
            else if (typeof parse.match === 'function')
              cond = parse.match(message, argument)
            if (cond && typeof parse.perform === 'function') {
              let res = parse.perform(message, argument)
              if (res instanceof Promise)
                res = await res;
              argument = res;
            }
          };

        map.set(this._args[i].key, argument)
      }

      if (this.callMiddlewares(message, map))
        this._handler(message, map);
    }
  }

  callMiddlewares(message) {
    let ret = true;
    this._middlewares.every(middleware => {
      return !middleware(this, message) ? ret = false : true;
    });
    return ret;
  }

  sub(cmd: string | Command, handler: Function = () => null) {
    const CommandBuilder = require('./Builders/CommandBuilder');
    if (cmd instanceof Command)
      this._subs.push(cmd)
    else if (typeof cmd === 'string' && typeof handler === 'function')
      return (new CommandBuilder(null)).parent(this).command(cmd).handler(handler);
  }

  get command() {
    return this._command
  }
  get args() {
    return this._args
  }
  get middlewares() {
    return this._middlewares
  }
  get handler() {
    return this._handler
  }
  get subs() {
    return this._subs
  }

}

module.exports = Command;