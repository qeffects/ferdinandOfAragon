import { BotCommand, InquisitionStatus } from '../../types';
import prisma from '../../prisma';
import logger from '../../util/logger';
import { translate } from '../../lang/i18n';
import { DISCORD_BOT_PREFIX } from '../../util/secrets';

const targetCommand: BotCommand = {
  name: 'target',
  description: translate('INQUISITION_SET_TARGET_DESCRIPTION', {}),
  guildOnly: true,
  args: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    logger.debug('target');

    const mentionedMember = message.mentions.members.first();
    if (!mentionedMember) {
      await message.reply(translate('INQUISITION_SET_TARGET_NO_TARGET', {}));
      return;
    }

    const updatedBotConfig = await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        inquisition_target: mentionedMember.id,
      },
    });

    await message.channel.send(
      translate('INQUISITION_SET_TARGET_SUCCESS', {
        target: mentionedMember.id,
      })
    );

    if (
      updatedBotConfig.inquisition_channel &&
      updatedBotConfig.inquisition_role &&
      updatedBotConfig.inquisition_target
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

export default targetCommand;
