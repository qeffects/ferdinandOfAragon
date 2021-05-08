import { translate } from '../../lang/i18n';
import prisma from '../../prisma';
import { BotCommand } from '../../types';

const askQuick: BotCommand = {
  name: 'askQuick',
  description: translate('INQUISITION_QUICK_QUESTIONS_DESCRIPTION', {}),
  guildOnly: true,
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    const user = message.mentions?.members.first();

    if (!user) {
      await message.reply(translate('INQUISITION_QUICK_QUESTIONS_NOUSER', {}));
      return;
    }

    const msg = message.content.slice(message.content.search('>') + 1);

    const botConfig = await prisma.botConfig.findFirst({
      where: { guild: message.guild.id },
    });

    const inquisitionRole = message.guild.roles.resolve(
      botConfig.inquisition_role
    );

    if (!botConfig) {
      await message.reply(translate('BOT_CONFIG_NOT_FOUND', {}));
      return;
    }

    let saveQuestion = true;

    const inquisitionChannel = message.guild.channels.resolve(
      botConfig.inquisition_channel
    );

    if (!inquisitionChannel?.isText()) {
      await message.reply(translate('INQUISITION_CHANNEL_INVALID', {}));
      return;
    }

    const allQuestionCount =
      (await prisma.inquisitionQuestion.count({
        where: { guild: message.guild.id },
      })) + 1;

    const lastInquisitionChannelMessage = inquisitionChannel.lastMessage;

    if (
      allQuestionCount === 1 &&
      lastInquisitionChannelMessage &&
      lastInquisitionChannelMessage.author.id === message.client.user.id &&
      lastInquisitionChannelMessage.content.startsWith(
        '**Pagaidām jautājumu nav'
      )
    ) {
      await lastInquisitionChannelMessage.delete();
      await inquisitionChannel.send(`**<@${user.id}> ${msg}**`);
      await user.roles.add(inquisitionRole.id, 'Sākam inkvizīciju');

      saveQuestion = false;
    }

    if (saveQuestion) {
      await prisma.quickQuestion.create({
        data: {
          guild: message.guild.id,
          question: msg,
          target: user.id,
        },
      });
    }

    await message.reply(translate('INQUISITION_QUICK_QUESTIONS_SUCCESS', {}));
  },
};

export default askQuick;
