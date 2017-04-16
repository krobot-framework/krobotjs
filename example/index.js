const Discord = require('discord.js');
const {
  CommandManager
} = require('../lib/Krobotjs');

const bot = new Discord.Client();
const commands = new CommandManager({
  parse: [{
    // Match user (<@ID>)
    match(message, arg) {
      return (/^<@((\d)+)>$/g).test(arg)
    },
    // Replace it with an instance of Discord.User(ID)
    async perform(message, arg) {
      const gmember = await message.channel.guild.fetchMember((/^<@((\d)+)>$/g).exec(arg)[1]);
      return gmember.user;
    }
  }]
});
// Create a command group
commands.group().prefix("#").apply(_ => {
  commands
    .command("test <message> <nb:^[0-9]+$> [opt]", (message, args) => message.reply('test')).register()
    .sub("moche", (message, args) => message.reply('t es moche')).register();
  commands
    .command("lol <message>", (message, args) => message.reply('lol')).register()
    .sub("test", (message, args) => message.reply('lol test')).register();
  commands
    .command("test2 <message...>", (message, args) => message.reply(args.get('message').join(' '))).register()
    .sub("moche", (message, args) => message.reply('t es moche 2')).register();
});

bot.on('message', message => {
  // If the message is a command, then it will be executed and will return "true"
  // yet, if there is no command, it will return "false"
  if (!commands.dispatch(message)) {
    // continue actions
  }
});
bot.on('ready', _ => console.log('Connected'));
bot.on('reconnecting', _ => console.log('Reconnecting'));
bot.on('error', error => console.error(error));

process.on('uncaughtException', err => console.log(err));

bot.login(process.env.DISCORD_TOKEN);