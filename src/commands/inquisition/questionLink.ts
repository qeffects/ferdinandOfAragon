import { translate } from '../../lang/i18n';
import prisma from '../../prisma';

import { BotCommand } from '../../types';
import logger from '../../util/logger';

const questionLinkCommand: BotCommand = {
  name: 'questionLink',
  description: translate('INQUISITION_SET_QUESTION_LINK_DESCRIPTION', {}),
  guildOnly: true,
  args: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message, [link]) {
    logger.debug('questionLink');

    if (!link.trim()) {
      await message.reply(
        translate('INQUISITION_SET_QUESTION_LINK_NO_LINK', {})
      );
      return;
    }

    await prisma.botConfig.update({
      where: {
        guild: message.guild.id,
      },
      data: {
        inquisition_question_submit_link: link.trim(),
      },
    });
  },
};

export default questionLinkCommand;
