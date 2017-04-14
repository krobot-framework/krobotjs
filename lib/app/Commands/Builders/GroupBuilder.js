'use strict';

let GroupBuilder = class GroupBuilder {

  constructor(commandManager, defaultPrefix) {
    this._commandManager = commandManager;
    this._middlewares = [];
    this._prefix = defaultPrefix;
    this._parent = null;
  }

  parent(parent) {
    this._parent = parent;
    return this;
  }

  prefix(prefix) {
    if (!this._parent || this.parent && !this._parent.prefix) this._prefix = prefix;else throw new Error('you cannot redefine the prefix of a sub group');
    return this;
  }

  middleware(middleware) {
    if (typeof middleware === 'function') this._middlewares.push(middleware);else if (middleware instanceof Array) this._middlewares.concat(middleware);else throw new Error('must be a function or an array of function');
    return this;
  }

  apply(cb) {
    if (typeof cb !== 'function') throw new Error('the callback must be a function');
    this._commandManager.push({
      prefix: this._prefix,
      middlewares: this._middlewares,
      parent: this._parent
    });
    cb();
    this._commandManager.pop();
  }

};


module.exports = GroupBuilder;