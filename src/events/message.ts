import Discord from 'discord.js';

import { DISCORD_BOT_PREFIX } from '../util/secrets';
import logger from '../util/logger';
import { BotEvent, BotClient } from '../types';
import { translate } from '../lang/i18n';
import quickAnswer from './quickAnswer';

const messageEvent: BotEvent = {
  name: 'message',
  async execute(
    message: Exclude<Discord.Message, 'client'> & {
      client: BotClient;
    }
  ) {
    await quickAnswer(message);

    logger.debug(`${message}`);

    const validPrefixes = [
      `(<@!?${message.client.user.id}>`,
      DISCORD_BOT_PREFIX,
    ];
    let foundPrefix = '';

    const commandsWithoutPrefix = message.client.commands
      .filter((command) => command.withPrefix != null && !command.withPrefix)
      .map((command) => command.name);

    // eslint-disable-next-line no-restricted-syntax
    for (const prefix of validPrefixes) {
      if (message.content.startsWith(prefix)) {
        foundPrefix = prefix;
        break;
      }
    }

    if (
      !foundPrefix &&
      !commandsWithoutPrefix.some((commandName) =>
        message.content.startsWith(commandName)
      )
    ) {
      return;
    }

    const [commandName, ...commandArgs] = message.content
      .slice(foundPrefix.length)
      .split(' ');

    if (!message.client.commands.has(commandName)) {
      return;
    }

    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      return;
    }

    if (command.guildOnly && message.channel.type === 'dm') {
      await message.reply(translate('COMMAND_CHANNEL_ONLY', {}));
      return;
    }

    if (command.permissions) {
      if (message.channel.type === 'dm') {
        await message.reply(translate('COMMAND_CHANNEL_ONLY', {}));
        return;
      }

      const authorPerms = message.channel.permissionsFor(message.author);

      if (
        !authorPerms ||
        !command.permissions.every((permission) => authorPerms.has(permission))
      ) {
        await message.reply(translate('COMMAND_NOT_ALLOWED', {}));
        return;
      }
    }

    if (command.args && !commandArgs.length) {
      let reply = translate('COMMAND_MISSING_ARGS', {
        author: message.author.username,
      }) as string;

      if (command.usage) {
        reply += translate('COMMAND_USAGE', {
          command: `${DISCORD_BOT_PREFIX}${command.name}`,
          usage: command.usage,
        }) as string;
      }

      await message.channel.send(reply);

      return;
    }

    const { cooldowns } = message.client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;

        await message.reply(
          translate('COMMAND_COOLDOWN', {
            seconds: timeLeft.toFixed(1),
            command: command.name,
          })
        );

        return;
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      await command.execute(message, commandArgs);
    } catch (error) {
      logger.error(error.message);
      message.reply(translate('COMMAND_UNKNOWN_ERROR', {}));
    }
  },
};

export default messageEvent;
