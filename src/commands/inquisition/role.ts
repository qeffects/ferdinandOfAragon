import { DISCORD_BOT_PREFIX } from '../../util/secrets';
import { translate } from '../../lang/i18n';
import prisma from '../../prisma';
import { BotCommand, InquisitionStatus } from '../../types';
import logger from '../../util/logger';

const inqRoleCommand: BotCommand = {
  name: 'inqRole',
  description: translate('INQUISITION_SET_ROLE_DESCRIPTION', {}),
  guildOnly: true,
  args: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    logger.debug('inqRoleCommand called...');
    const mentionedRole = message.mentions.roles.first();

    if (!mentionedRole) {
      await message.reply(translate('INQUISITION_SET_ROLE_NO_ROLE', {}));
      return;
    }

    const updatedBotConfig = await prisma.botConfig.update({
      where: { guild: message.guild.id },
      data: {
        inquisition_role: mentionedRole.id,
      },
    });

    if (!updatedBotConfig) {
      await message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    await message.channel.send(
      translate('INQUISITION_SET_ROLE_SUCCESS', {
        roleId: mentionedRole.name,
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

export default inqRoleCommand;
