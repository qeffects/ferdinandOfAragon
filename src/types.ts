import type Discord from 'discord.js';

export type BotClient = Discord.Client & {
  // eslint-disable-next-line no-use-before-define
  commands?: Discord.Collection<string, BotCommand>;
  cooldowns?: Discord.Collection<
    string,
    Discord.Collection<Discord.User['id'], number>
  >;
};

export type BotCommand = {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  args?: boolean;
  cooldown?: number;
  guildOnly?: boolean;
  permissions?: Discord.PermissionString[];
  withPrefix?: boolean;
  execute: (
    message: Exclude<Discord.Message, 'client'> & {
      client: BotClient;
    },
    args: string[]
  ) => void;
};

export type BotEvent = {
  name: string;
  once?: boolean;
  execute: (...args: unknown[]) => void;
};

export enum InquisitionStatus {
  SETUP,
  READY,
  IN_PROGRESS,
}
