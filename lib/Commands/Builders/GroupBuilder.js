'use strict';

var _dec, _class;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let GroupBuilder = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('GroupBuilder', _flowRuntime2.default.method('constructor', _flowRuntime2.default.param('commandManager', _flowRuntime2.default.any()), _flowRuntime2.default.param('defaultPrefix', _flowRuntime2.default.any())), _flowRuntime2.default.method('parent', _flowRuntime2.default.param('parent', _flowRuntime2.default.any())), _flowRuntime2.default.method('prefix', _flowRuntime2.default.param('prefix', _flowRuntime2.default.string())), _flowRuntime2.default.method('middleware', _flowRuntime2.default.param('middleware', _flowRuntime2.default.union(_flowRuntime2.default.function(), _flowRuntime2.default.array(_flowRuntime2.default.function())))), _flowRuntime2.default.method('apply', _flowRuntime2.default.param('cb', _flowRuntime2.default.function())))), _dec(_class = class GroupBuilder {

  constructor(commandManager, defaultPrefix) {
    this._commandManager = commandManager;
    this._middlewares = [];
    this._prefix = defaultPrefix;
    this._parent = null;
  }

  parent(parent) {
    console.log(parent);
    this._parent = parent;
    return this;
  }

  prefix(prefix) {
    let _prefixType = _flowRuntime2.default.string();

    _flowRuntime2.default.param('prefix', _prefixType).assert(prefix);

    if (!this._parent || this.parent && !this._parent.prefix) this._prefix = prefix;
    return this;
  }

  middleware(middleware) {
    let _middlewareType = _flowRuntime2.default.union(_flowRuntime2.default.function(), _flowRuntime2.default.array(_flowRuntime2.default.function()));

    _flowRuntime2.default.param('middleware', _middlewareType).assert(middleware);

    if (typeof middleware === 'function') this._middlewares.push(middleware);else if (middleware instanceof Array) this._middlewares.concat(middleware);
    return this;
  }

  apply(cb) {
    let _cbType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('cb', _cbType).assert(cb);

    this._commandManager.push({
      prefix: this._prefix,
      middlewares: this._middlewares,
      parent: this._parent
    });
    cb();
    this._commandManager.pop();
  }

}) || _class);


module.exports = GroupBuilder;