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

    if (botConfig.inquisition_target && botConfig.inquisition_role) {
      const member = await message.guild.member(botConfig.inquisition_target);

      if (member?.roles.cache.has(botConfig.inquisition_role)) {
        member.roles.remove(botConfig.inquisition_role, 'Beidzam inkvizīciju');
      }
    }

    if (
      botConfig.inquisition_channel &&
      botConfig.inquisition_no_more_questions_msg_id
    ) {
      const inquisitionChannel = await message.guild.channels.resolve(
        botConfig.inquisition_channel
      );

      if (inquisitionChannel?.isText()) {
        const lastNoMoreQuestionsMessage = inquisitionChannel.messages.resolve(
          botConfig.inquisition_no_more_questions_msg_id
        );
        await lastNoMoreQuestionsMessage.delete();
      }
    }

    await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        inquisition_no_more_questions_msg_id: null,
        inquisition_status: InquisitionStatus.READY,
        quick_inquisition_status: InquisitionStatus.READY,
      },
    });

    await message.channel.send(`Inkvizīcija apstādināta`);
  },
};

export default stopCommand;
