import Discord from 'discord.js';
import { translate } from '../lang/i18n';
import prisma from '../prisma';

const quickAnswer = async (message: Discord.Message): Promise<void> => {
  const botConfig = await prisma.botConfig.findFirst({
    where: { guild: message.guild.id },
  });

  if (!botConfig) {
    return;
  }

  if (
    message.channel.id &&
    botConfig.inquisition_channel === message.channel.id &&
    message.author.id === botConfig.inquisition_target
  ) {
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

    const firstQuestion = await prisma.quickQuestion.findFirst({
      orderBy: {
        created_at: 'asc',
      },
    });

    if (!firstQuestion) {
      await inquisitionChannel.send(
        translate('INQUISITION_NO_MORE_QUESTIONS_LEFT', {
          questionLink: botConfig.inquisition_question_submit_link,
        })
      );
      const oldUser = message.guild.members.resolve(
        botConfig.inquisition_target
      );
      await oldUser.roles.remove(inquisitionRole.id, 'Beidzam inkvizīciju');
    }

    const newUser = message.guild.members.resolve(firstQuestion.target);
    const oldUser = message.guild.members.resolve(botConfig.inquisition_target);

    await oldUser.roles.remove(inquisitionRole.id, 'Beidzam inkvizīciju');
    await newUser.roles.add(inquisitionRole.id, 'Sākam inkvizīciju');

    await inquisitionChannel.send(
      `<@!${firstQuestion.target}> ${firstQuestion.question}`
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
        inquisition_target: newUser.id,
      },
    });
  }
};

export default quickAnswer;
