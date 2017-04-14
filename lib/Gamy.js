'use strict';

const Discord = require('discord.js');
const CommandManager = require('./Commands/CommandManager');

const defOpts = {};

let Gamy = class Gamy {
  constructor(token, opts) {
    this._token = token;
    this._client = new Discord.Client();
    this._config = Object.assign({}, defOpts, opts);
    this._commandManager = new CommandManager();
    this.initCommands();
    this._events();
  }

  initCommands() {
    const commands = this._commandManager;
    commands.group().prefix("#").middleware(message => {
      console.log('middleware1');
      return true;
    }).apply(_ => {
      commands.command("test <message> <nb:^[0-9]+$> [opt]", (message, args) => message.reply('test')).register().sub("moche", (message, args) => message.reply('t es moche')).register();
      commands.command("lol <message>", (message, args) => message.reply('lol')).register().sub("test", (message, args) => message.reply('lol test')).register();
      commands.command("test2 <message>", (message, args) => message.reply('test2')).register().sub("moche", (message, args) => message.reply('t es moche 2')).register();
    });
  }

  _events() {
    this._client.on('ready', _ => console.log('Connected'));
    this._client.on('reconnecting', _ => console.log('Reconnecting'));
    this._client.on('message', message => this._commandManager.onMessage(message));
    this._client.on('error', error => console.error(error));
  }

  set config(config) {
    this._config = config;
  }

  start() {
    this._client.login(this._token);
  }

};


module.exports = Gamy;