import fs from 'fs';
import path from 'path';
import Discord from 'discord.js';

import { BotClient } from './types';

import logger from './util/logger';
import { DISCORD_BOT_TOKEN } from './util/secrets';

import i18next from './lang/i18n';

const loadCommands = async (client: BotClient) => {
  /* eslint-disable no-param-reassign */
  client.commands = new Discord.Collection();
  client.cooldowns = new Discord.Collection();
  /* eslint-enable no-param-reassign */

  const commandFolders = fs.readdirSync(path.resolve(__dirname, './commands'));

  // eslint-disable-next-line no-restricted-syntax
  for (const folder of commandFolders) {
    logger.debug(folder);

    const commandFiles = fs
      .readdirSync(path.resolve(__dirname, `./commands/${folder}`))
      .filter((file) => file.endsWith('.js'));

    // eslint-disable-next-line no-restricted-syntax
    for (const file of commandFiles) {
      /* eslint-disable no-await-in-loop */
      const command = (
        await import(path.resolve(__dirname, `./commands/${folder}/${file}`))
      ).default;
      /* eslint-enable no-await-in-loop */

      logger.debug(command.name, 'loaded');

      client.commands.set(command.name, command);
    }
  }
};

const loadEventHandlers = async (client: BotClient) => {
  const eventFiles = fs
    .readdirSync(path.resolve(__dirname, './events'))
    .filter((file) => file.endsWith('.js'));

  // eslint-disable-next-line no-restricted-syntax
  for (const file of eventFiles) {
    // eslint-disable-next-line no-await-in-loop
    const event = (await import(path.resolve(__dirname, `./events/${file}`)))
      .default;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
};

export default async (): Promise<void> => {
  await i18next;

  // create a new Discord client
  const client: BotClient = new Discord.Client({
    presence: {
      activity: {
        name: 'inquisition',
      },
    },
    ws: {
      intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
    },
  });

  await loadCommands(client);
  await loadEventHandlers(client);

  // login to Discord with your app's token
  client.login(DISCORD_BOT_TOKEN);
};
