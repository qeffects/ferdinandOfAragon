import { translate } from '../../lang/i18n';
import prisma from '../../prisma';
import { BotCommand } from '../../types';

const clearCommand: BotCommand = {
  name: 'clear',
  description: translate('INQUISITION_CLEAR_QUESTIONS_DESCRIPTION', {}),
  guildOnly: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    await prisma.inquisitionQuestion.deleteMany({
      where: {
        guild: message.guild.id,
      },
    });

    await prisma.quickQuestion.deleteMany({
      where: {
        guild: message.guild.id,
      },
    });

    await message.reply(translate('INQUISITION_CLEAR_QUESTIONS_SUCCESS', {}));
  },
};

export default clearCommand;
