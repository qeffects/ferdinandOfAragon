import { translate } from '../../lang/i18n';
import prisma from '../../prisma';

import { BotCommand } from '../../types';
import logger from '../../util/logger';

const nextCommand: BotCommand = {
  name: 'Next!',
  description: translate('INQUISITION_NEXT_QUESTION_DESCRIPTION', {}),
  guildOnly: true,
  withPrefix: false,
  async execute(message) {
    // Since these is command which can be called without prefix -
    // avoid doing something silly, and don't respond if some part of the bot is not configured
    // or message is coming from some other channel than inquisition channel

    logger.debug('next');

    const botConfig = await prisma.botConfig.findFirst({
      where: {
        guild: message.guild.id,
      },
    });

    // First of all lets check if everything is setup for inquisition to happen
    if (
      !botConfig ||
      !botConfig.inquisition_channel ||
      !botConfig.inquisition_role ||
      !botConfig.inquisition_target
    ) {
      return;
    }

    const inquisitionChannel = message.guild.channels.resolve(
      botConfig.inquisition_channel
    );

    // Is inquisitionChannel valid and message is coming from from it?
    if (!inquisitionChannel || message.channel.id !== inquisitionChannel.id) {
      return;
    }

    const inquisitionRole = message.guild.roles.resolve(
      botConfig.inquisition_role
    );

    // Is inquisition role valid and message author has it?
    if (
      !inquisitionRole ||
      !message.guild
        .member(message.author.id)
        .roles.cache.has(inquisitionRole.id)
    ) {
      if (!inquisitionRole) {
        logger.warn(`Role with id ${botConfig.inquisition_role} not found`);
        return;
      }

      logger.warn(
        `${message.author.username} does not have ${inquisitionRole.name} role`
      );
      return;
    }

    if (!inquisitionChannel.isText()) {
      await message.reply(translate('INQUISITION_CHANNEL_INVALID', {}));
      return;
    }

    const question = await prisma.inquisitionQuestion.findFirst({
      where: {
        guild: message.guild.id,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    if (!question) {
      if (botConfig.inquisition_no_more_questions_msg_id) {
        const lastNoMoreQuestionsMessage = inquisitionChannel.messages.resolve(
          botConfig.inquisition_no_more_questions_msg_id
        );

        await lastNoMoreQuestionsMessage?.delete();
      }

      const noMoreQuestionsLeftMessage = await inquisitionChannel.send(
        translate('INQUISITION_NO_MORE_QUESTIONS_LEFT', {
          questionLink: botConfig.inquisition_question_submit_link,
        })
      );

      await prisma.botConfig.update({
        where: {
          guild: message.guild.id,
        },
        data: {
          inquisition_no_more_questions_msg_id: noMoreQuestionsLeftMessage.id,
        },
      });

      return;
    }

    await inquisitionChannel.send(`**${question.question}**`);

    await prisma.inquisitionQuestion.delete({
      where: {
        id: question.id,
      },
    });
  },
};

export default nextCommand;
