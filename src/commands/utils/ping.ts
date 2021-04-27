import { BotCommand } from '../../types';

const pingCommand: BotCommand = {
  name: 'ping',
  description: 'Ping!',
  usage: '!ping',
  execute(message) {
    message.channel.send(`Websocket heartbeat: ${message.client.ws.ping}ms.`);
    message.channel.send('Pinging...').then((sent) => {
      sent.edit(
        `Roundtrip latency: ${
          sent.createdTimestamp - message.createdTimestamp
        }ms`
      );
    });
  },
};

export default pingCommand;
