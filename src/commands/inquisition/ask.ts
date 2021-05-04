import { translate } from '../../lang/i18n';
import prisma from '../../prisma';

import { BotCommand, InquisitionStatus } from '../../types';
import logger from '../../util/logger';

const askCommand: BotCommand = {
  name: 'ask',
  description: translate('INQUISITION_ADD_QUESTION_DESCRIPTION', {}),
  guildOnly: true,
  args: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    logger.debug('ask');

    const question = args.join(' ');
    let saveQuestion = true;

    if (!question.trim()) {
      await message.reply(
        translate('INQUISITION_ADD_QUESTION_NO_QUESTION', {})
      );
      return;
    }

    // Existing questions in db + 1 new one to be created OR sent
    const allQuestionCount =
      (await prisma.inquisitionQuestion.count({
        where: { guild: message.guild.id },
      })) + 1;

    const botConfig = await prisma.botConfig.findFirst({
      where: { guild: message.guild.id },
    });

    if (!botConfig) {
      await message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    if (
      allQuestionCount === 1 &&
      botConfig.inquisition_status.toNumber() ===
        InquisitionStatus.IN_PROGRESS &&
      botConfig.inquisition_no_more_questions_msg_id
    ) {
      const inquisitionChannel = message.guild.channels.resolve(
        botConfig.inquisition_channel
      );

      if (!inquisitionChannel?.isText()) {
        await message.reply(translate('INQUISITION_CHANNEL_INVALID', {}));
        return;
      }

      const lastNoMoreQuestionsMessage = inquisitionChannel.messages.resolve(
        botConfig.inquisition_no_more_questions_msg_id
      );

      await lastNoMoreQuestionsMessage?.delete();

      await prisma.botConfig.update({
        where: {
          guild: message.guild.id,
        },
        data: {
          inquisition_no_more_questions_msg_id: null,
        },
      });

      await inquisitionChannel.send(`**${question}**`);
      saveQuestion = false;
    }

    if (saveQuestion) {
      await prisma.inquisitionQuestion.create({
        data: {
          guild: message.guild.id,
          question,
        },
      });
    }

    await message.channel.send(
      translate('INQUISITION_ADD_QUESTION_SUCCESS', {
        questionCount: allQuestionCount,
      })
    );
  },
};

export default askCommand;
