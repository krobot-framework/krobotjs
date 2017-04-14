// @flow
class GroupBuilder {

  constructor(commandManager, defaultPrefix) {
    this._commandManager = commandManager;
    this._middlewares = [];
    this._prefix = defaultPrefix;
    this._parent = null;
  }

  parent(parent) {
    console.log(parent)
    this._parent = parent;
    return this;
  }

  prefix(prefix: string) {
    if (!this._parent || (this.parent && !this._parent.prefix))
      this._prefix = prefix;
    return this;
  }

  middleware(middleware: Function | Array<Function>) {
    if (typeof middleware === 'function')
      this._middlewares.push(middleware);
    else if (middleware instanceof Array)
      this._middlewares.concat(middleware);
    return this;
  }

  apply(cb: Function) {
    this._commandManager.push({
      prefix: this._prefix,
      middlewares: this._middlewares,
      parent: this._parent
    });
    cb();
    this._commandManager.pop();
  }

}

module.exports = GroupBuilder;