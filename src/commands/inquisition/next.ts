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
    logger.debug('next');

    const botConfig = await prisma.botConfig.findFirst({
      where: {
        guild: message.guild.id,
      },
    });

    if (!botConfig) {
      await message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    const inquisitionRole = message.guild.roles.resolve(
      botConfig.inquisition_role
    );

    if (!inquisitionRole) {
      await message.reply(translate('INQUISITION_ROLE_INVALID', {}));
      return;
    }

    if (
      !message.guild
        .member(message.author.id)
        .roles.cache.has(inquisitionRole.id)
    ) {
      return;
    }

    const inquisitionChannel = await message.guild.channels.resolve(
      botConfig.inquisition_channel
    );

    if (!inquisitionChannel?.isText()) {
      await message.reply(translate('INQUISITION_CHANNEL_INVALID', {}));
      return;
    }

    // Since these is command which can be called without prefix -
    // avoid doing something silly, if phrase "Next!" came from some other channel :)
    if (message.channel.id !== inquisitionChannel.id) {
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
      await inquisitionChannel.send(
        translate('INQUISITION_NO_MORE_QUESTIONS_LEFT', {
          questionLink: botConfig.inquisition_question_submit_link,
        })
      );
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
