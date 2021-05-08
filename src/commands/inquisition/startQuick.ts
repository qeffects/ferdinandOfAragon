import logger from '../../util/logger';
import { translate } from '../../lang/i18n';
import prisma from '../../prisma';

import { BotCommand, InquisitionStatus } from '../../types';

const startQuickCommand: BotCommand = {
  name: 'startQuick',
  description: translate('INQUISITION_START_DESCRIPTION', {}),
  guildOnly: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    logger.debug('startQuick');

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

    const firstQuestion = await prisma.quickQuestion.findFirst({
      orderBy: {
        created_at: 'asc',
      },
    });

    if (!firstQuestion) {
      await message.reply(translate('INQUISITION_START_NO_QUESTIONS', {}));
      return;
    }

    await inquisitionChannel.send(
      translate('INQUISITION_QUICK_START_ANNOUNCEMENT', {})
    );

    await inquisitionChannel.send(
      `<@!${firstQuestion.target}> ${firstQuestion.question}`
    );

    const user = message.guild.members.resolve(firstQuestion.target);

    await user.roles.add(inquisitionRole.id, 'Sākam inkvizīciju');

    await message.channel.send(
      translate('INQUISITION_QUICK_START_SUCCESS', {})
    );

    await prisma.quickQuestion.delete({
      where: {
        id: firstQuestion.id,
      },
    });

    await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        quick_inquisition_status: InquisitionStatus.IN_PROGRESS,
        inquisition_target: user.id,
      },
    });
  },
};

export default startQuickCommand;
