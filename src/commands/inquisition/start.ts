import logger from '../../util/logger';
import { translate } from '../../lang/i18n';
import prisma from '../../prisma';

import { BotCommand, InquisitionStatus } from '../../types';

const startCommand: BotCommand = {
  name: 'start',
  description: translate('INQUISITION_START_DESCRIPTION', {}),
  guildOnly: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    logger.debug('start');

    const botConfig = await prisma.botConfig.findFirst({
      where: {
        guild: message.guild.id,
      },
    });

    if (!botConfig) {
      await message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    if (!botConfig.inquisition_role) {
      await message.reply(translate('BOT_CONFIG_INQUISITION_ROLE_NOT_SET', {}));
      return;
    }

    if (!botConfig.inquisition_channel) {
      await message.reply(
        translate('BOT_CONFIG_INQUISITION_CHANNEL_NOT_SET', {})
      );
      return;
    }

    const inquisitionChannel = message.guild.channels.resolve(
      botConfig.inquisition_channel
    );

    if (!inquisitionChannel?.isText()) {
      await message.reply(translate('INQUISITION_CHANNEL_INVALID', {}));
      return;
    }

    const inquisitionRole = message.guild.roles.resolve(
      botConfig.inquisition_role
    );

    if (!inquisitionRole) {
      await message.reply(translate('INQUISITION_ROLE_INVALID', {}));
      return;
    }

    const inquisitionTargetUser = message.guild.member(
      botConfig.inquisition_target
    );

    if (!inquisitionTargetUser) {
      await message.reply(translate('INQUISITION_START_MEMBER_NOT_FOUND', {}));
      return;
    }

    const firstQuestion = await prisma.inquisitionQuestion.findFirst({
      orderBy: {
        created_at: 'asc',
      },
    });

    const allQuestionCount = await prisma.inquisitionQuestion.count({
      where: {
        guild: message.guild.id,
      },
    });

    if (!firstQuestion) {
      await message.reply(translate('INQUISITION_START_NO_QUESTIONS', {}));
      return;
    }

    await inquisitionTargetUser.roles.add(
      inquisitionRole.id,
      'Sākam inkvizīciju'
    );

    await inquisitionChannel.send(
      translate('INQUISITION_START_ANNOUNCEMENT', {
        username: inquisitionTargetUser.displayName,
      })
    );

    await inquisitionChannel.send(
      translate('INQUISITION_START_FIRST_QUESTION', {
        question: firstQuestion.question,
      })
    );

    await message.channel.send(
      translate('INQUISITION_START_SUCCESS', {
        questionCount: `${allQuestionCount}`,
      })
    );

    await prisma.inquisitionQuestion.delete({
      where: {
        id: firstQuestion.id,
      },
    });

    await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        inquisition_status: InquisitionStatus.IN_PROGRESS,
      },
    });
  },
};

export default startCommand;
