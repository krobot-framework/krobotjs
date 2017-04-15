'use strict';

var _dec, _class;

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let Command = (_dec = _flowRuntime2.default.annotate(_flowRuntime2.default.class('Command', Command => {
  return [_flowRuntime2.default.method('constructor', _flowRuntime2.default.param('command', _flowRuntime2.default.any()), _flowRuntime2.default.param('args', _flowRuntime2.default.any()), _flowRuntime2.default.param('middlewares', _flowRuntime2.default.any()), _flowRuntime2.default.param('handler', _flowRuntime2.default.any())), _flowRuntime2.default.method('call', _flowRuntime2.default.param('parser', _flowRuntime2.default.any()), _flowRuntime2.default.param('message', _flowRuntime2.default.any()), _flowRuntime2.default.param('args', _flowRuntime2.default.any())), _flowRuntime2.default.method('callMiddlewares', _flowRuntime2.default.param('message', _flowRuntime2.default.any())), _flowRuntime2.default.method('sub', _flowRuntime2.default.param('cmd', _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Command))), _flowRuntime2.default.param('handler', _flowRuntime2.default.function())), _flowRuntime2.default.method('command'), _flowRuntime2.default.method('args'), _flowRuntime2.default.method('middlewares'), _flowRuntime2.default.method('handler'), _flowRuntime2.default.method('subs')];
})), _dec(_class = class Command {

  constructor(command, args, middlewares, handler) {
    this._command = command;
    this._args = args;
    this._middlewares = middlewares;
    this._handler = handler;
    this._subs = [];
  }

  call(parser, message, args) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let subCalled = false;
      if (args.length > 0) {
        _this._subs.forEach(function (sub) {
          if (sub.command === args[0]) {
            if (_this.callMiddlewares(message)) {
              sub.call(parser, message, args.slice(1));
              subCalled = true;
            }
            return;
          }
        });
      }
      if (!subCalled) {
        const map = new Map();
        for (let i = 0; i < _this._args.length; i++) {
          let argument = args[i];

          if (!_this._args[i].optional && !argument) return;

          if (_this._args[i].list) {
            argument = args.splice(i);
            let match = true;
            argument.every(function (val) {
              if (_this._args[i].regex.test(val)) return true;else return match = false;
            });
            if (!match) return;
          } else {
            const test = _this._args[i].regex.test(argument);
            if (!test) return;
            if (i + 1 === _this._args.length && i + 1 < args.length) return;
          }

          if (parser && parser instanceof Array) for (let i = 0; i < parser.length; i++) {
            const parse = parser[i];
            let cond = false;
            if (parse.match instanceof RegExp) cond = parse.match.test(argument);else if (typeof parse.match === 'function') cond = parse.match(message, argument);
            if (cond && typeof parse.perform === 'function') {
              let res = parse.perform(message, argument);
              if (res instanceof Promise) res = yield res;
              argument = res;
            }
          };

          map.set(_this._args[i].key, argument);
        }

        if (_this.callMiddlewares(message, map)) _this._handler(message, map);
      }
    })();
  }

  callMiddlewares(message) {
    let ret = true;
    this._middlewares.every(middleware => {
      return !middleware(this, message) ? ret = false : true;
    });
    return ret;
  }

  sub(cmd, handler = () => null) {
    let _cmdType = _flowRuntime2.default.union(_flowRuntime2.default.string(), _flowRuntime2.default.ref(Command));

    let _handlerType = _flowRuntime2.default.function();

    _flowRuntime2.default.param('cmd', _cmdType).assert(cmd);

    _flowRuntime2.default.param('handler', _handlerType).assert(handler);

    const CommandBuilder = require('./Builders/CommandBuilder');
    if (cmd instanceof Command) this._subs.push(cmd);else if (typeof cmd === 'string' && typeof handler === 'function') return new CommandBuilder(null).parent(this).command(cmd).handler(handler);
  }

  get command() {
    return this._command;
  }
  get args() {
    return this._args;
  }
  get middlewares() {
    return this._middlewares;
  }
  get handler() {
    return this._handler;
  }
  get subs() {
    return this._subs;
  }

}) || _class);


module.exports = Command;