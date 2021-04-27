import { DISCORD_BOT_PREFIX } from '../../util/secrets';
import { translate } from '../../lang/i18n';
import prisma from '../../prisma';
import { BotCommand, InquisitionStatus } from '../../types';
import logger from '../../util/logger';

const inqChannelCommand: BotCommand = {
  name: 'inqChannel',
  description: translate('INQUISITION_SET_CHANNEL_DESCRIPTION', {}),
  guildOnly: true,
  args: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    logger.debug('inqChannel called...');
    const mentionedChannel = message.mentions.channels.first();

    if (!mentionedChannel) {
      await message.reply(translate('INQUISITION_SET_CHANNEL_NO_CHANNEL', {}));
      return;
    }

    const updatedBotConfig = await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        inquisition_channel: mentionedChannel.id,
      },
    });

    if (!updatedBotConfig) {
      await message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    await message.channel.send(
      translate('INQUISITION_SET_CHANNEL_SUCCESS', {
        channel: `#${mentionedChannel.name}`,
      })
    );

    if (
      updatedBotConfig.inquisition_channel &&
      updatedBotConfig.inquisition_role
    ) {
      await prisma.botConfig.update({
        where: {
          guild: message.guild.id,
        },
        data: {
          inquisition_status: InquisitionStatus.READY,
        },
      });

      await message.channel.send(
        translate('INQUISITION_READY', { prefix: DISCORD_BOT_PREFIX })
      );
    }
  },
};

export default inqChannelCommand;
