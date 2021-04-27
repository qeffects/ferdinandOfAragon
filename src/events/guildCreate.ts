import { Guild } from 'discord.js';

import { BotEvent } from '../types';
import prisma from '../prisma';
import logger from '../util/logger';

const guildCreateEvent: BotEvent = {
  name: 'guildCreate',
  async execute(guild: Guild) {
    logger.debug('guildCreate');

    await prisma.botConfig.upsert({
      where: {
        guild: guild.id,
      },
      create: {
        guild: guild.id,
      },
      update: {},
    });
  },
};

export default guildCreateEvent;
