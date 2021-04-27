import prisma from '../prisma';
import { BotClient, BotEvent } from '../types';

import logger from '../util/logger';

const readyEvent: BotEvent = {
  name: 'ready',
  once: true,
  async execute(client: BotClient) {
    logger.info('Ready!');

    if (client.guilds) {
      const allGuildIds = client.guilds.cache.map((guild) => guild.id);

      const existingGuildIds = (
        await prisma.botConfig.findMany({
          where: {
            guild: {
              in: allGuildIds,
            },
          },
          select: {
            guild: true,
          },
        })
      ).map((botConfig) => botConfig.guild);

      const missingGuildIds = allGuildIds.filter(
        (guild) => !existingGuildIds.includes(guild)
      );

      // eslint-disable-next-line no-restricted-syntax
      for (const guildId of missingGuildIds) {
        // eslint-disable-next-line no-await-in-loop
        await prisma.botConfig.create({
          data: {
            guild: guildId,
          },
        });
      }
    }
  },
};

export default readyEvent;
