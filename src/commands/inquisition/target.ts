import { BotCommand } from '../../types';
import prisma from '../../prisma';
import logger from '../../util/logger';
import { translate } from '../../lang/i18n';

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

    await prisma.botConfig.update({
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
  },
};

export default targetCommand;
