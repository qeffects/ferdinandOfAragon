import { translate } from '../../lang/i18n';
import prisma from '../../prisma';
import { BotCommand, InquisitionStatus } from '../../types';
import logger from '../../util/logger';

const stopCommand: BotCommand = {
  name: 'stop',
  description: translate('INQUISITION_ADD_QUESTION_DESCRIPTION', {}),
  guildOnly: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    logger.debug('stop');

    const botConfig = await prisma.botConfig.findFirst({
      where: {
        guild: message.guild.id,
      },
    });

    if (!botConfig) {
      message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    await prisma.inquisitionQuestion.deleteMany({
      where: {
        guild: message.guild.id,
      },
    });

    await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        inquisition_status: InquisitionStatus.READY,
      },
    });

    const member = await message.guild.member(botConfig.inquisition_target);

    if (member) {
      member.roles.remove(botConfig.inquisition_role, 'Beidzam inkvizīciju');
    }

    await message.channel.send(`Inkvizīcija apstādināta`);
  },
};

export default stopCommand;
