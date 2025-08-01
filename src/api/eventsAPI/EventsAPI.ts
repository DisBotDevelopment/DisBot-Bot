import axios from "axios";
import * as Discord from "discord.js";
import { ExtendedClient } from "../../types/client.js";
import { LoggingAction } from "../../enums/loggingTypes.js";
import { Logger } from "../../main/logger.js";
import { Config } from "../../main/config.js";

async function sendEvent(type: string, data: any, guildId?: string) {
  try {
    await axios.post(
      `http://localhost:${Config.Other.EventsApi.ApiPort}/events`,
      {
        type,
        guildId: guildId || data.guild?.id || data.guildId,
        data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${Config.Other.EventsApi.ApiKey}`,
        },
      }
    );
  } catch (err) {
    console.error(`❌ Event error (${type}):`, err);
  }
}

export async function loadEventsAPI(client: ExtendedClient) {
  // Message Events
  client.on(Discord.Events.MessageCreate, async (message: Discord.Message) => {
    if (message.author.bot) return;
    await sendEvent("messageCreate", {
      message: message.toJSON(),
      guild: message.guild?.toJSON(),
      channel: message.channel.toJSON(),
      member: message.member?.toJSON(),
      user: message.author.toJSON(),
    });
  });

  client.on(
    Discord.Events.MessageUpdate,
    async (
      oldMessage: Discord.Message | Discord.PartialMessage,
      newMessage: Discord.Message | Discord.PartialMessage
    ) => {
      if (newMessage.author?.bot) return;

      // Fetch partial messages if necessary
      if (oldMessage.partial) {
        try {
          await oldMessage.fetch();
        } catch (err) {
          console.error("Failed to fetch old message:", err);
          return;
        }
      }
      if (newMessage.partial) {
        try {
          await newMessage.fetch();
        } catch (err) {
          console.error("Failed to fetch new message:", err);
          return;
        }
      }

      await sendEvent("messageUpdate", {
        oldMessage: oldMessage.toJSON(),
        newMessage: newMessage.toJSON(),
        guild: newMessage.guild?.toJSON(),
        channel: newMessage.channel.toJSON(),
        member: newMessage.member?.toJSON(),
        user: newMessage.author?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.MessageDelete,
    async (message: Discord.Message | Discord.PartialMessage) => {
      if (message.author?.bot) return;
      await sendEvent("messageDelete", {
        message: message.toJSON(),
        guild: message.guild?.toJSON(),
        channel: message.channel?.toJSON(),
        member: message.member?.toJSON(),
        user: message.author?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.MessageBulkDelete,
    async (
      messages: Discord.ReadonlyCollection<
        string,
        Discord.Message<boolean> | Discord.PartialMessage
      >,
      channel: Discord.GuildTextBasedChannel
    ) => {
      await sendEvent("messageBulkDelete", {
        messages: messages.map((m) => m.toJSON()),
        channel: channel.toJSON(),
        guild: channel.guild?.toJSON(),
      });
    }
  );

  // Reaction Events
  client.on(
    Discord.Events.MessageReactionAdd,
    async (
      reaction: Discord.MessageReaction | Discord.PartialMessageReaction,
      user: Discord.User | Discord.PartialUser
    ) => {
      if (user.bot) return;

      // Fetch partial reaction or user if necessary
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (err) {
          console.error("Failed to fetch reaction:", err);
          return;
        }
      }

      if (user.partial) {
        try {
          await user.fetch();
        } catch (err) {
          console.error("Failed to fetch user:", err);
          return;
        }
      }

      await sendEvent("messageReactionAdd", {
        reaction: reaction.toJSON(),
        message: reaction.message.toJSON(),
        user: user.toJSON(),
        guild: reaction.message.guild?.toJSON(),
        channel: reaction.message.channel.toJSON(),
        member: reaction.message.guild?.members.cache.get(user.id)?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.MessageReactionRemove,
    async (
      reaction: Discord.MessageReaction | Discord.PartialMessageReaction,
      user: Discord.User | Discord.PartialUser
    ) => {
      if (user.bot) return;

      // Fetch partial reaction or user if necessary
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (err) {
          console.error("Failed to fetch reaction:", err);
          return;
        }
      }

      if (user.partial) {
        try {
          await user.fetch();
        } catch (err) {
          console.error("Failed to fetch user:", err);
          return;
        }
      }

      await sendEvent("messageReactionRemove", {
        reaction: reaction.toJSON(),
        message: reaction.message.toJSON(),
        user: user.toJSON(),
        guild: reaction.message.guild?.toJSON(),
        channel: reaction.message.channel.toJSON(),
        member: reaction.message.guild?.members.cache.get(user.id)?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.MessageReactionRemoveAll,
    async (
      message: Discord.Message | Discord.PartialMessage,
      reactions: Discord.ReadonlyCollection<string, Discord.MessageReaction>
    ) => {
      await sendEvent("messageReactionRemoveAll", {
        message: message.toJSON(),
        guild: message.guild?.toJSON(),
        channel: message.channel.toJSON(),
        reactions: reactions.map((reaction) => reaction.toJSON()),
      });
    }
  );

  client.on(
    Discord.Events.MessageReactionRemoveEmoji,
    async (
      reaction: Discord.MessageReaction | Discord.PartialMessageReaction
    ) => {
      await sendEvent("messageReactionRemoveEmoji", {
        reaction: reaction.toJSON(),
        message: reaction.message?.toJSON(),
        guild: reaction.message?.guild?.toJSON(),
        channel: reaction.message?.channel?.toJSON(),
      });
    }
  );

  // Guild Events
  client.on(Discord.Events.GuildCreate, async (guild: Discord.Guild) => {
    await sendEvent("guildCreate", {
      guild: guild.toJSON(),
      joinedAt: guild.joinedAt?.toISOString(),
      ownerId: guild.ownerId,
    });
  });

  client.on(
    Discord.Events.GuildUpdate,
    async (oldGuild: Discord.Guild, newGuild: Discord.Guild) => {
      await sendEvent("guildUpdate", {
        oldGuild: oldGuild.toJSON(),
        newGuild: newGuild.toJSON(),
      });
    }
  );

  client.on(Discord.Events.GuildDelete, async (guild: Discord.Guild) => {
    await sendEvent("guildDelete", {
      guild: guild.toJSON(),
    });
  });

  client.on(Discord.Events.GuildUnavailable, async (guild: Discord.Guild) => {
    await sendEvent("guildUnavailable", {
      guild: guild.toJSON(),
    });
  });

  // Member Events
  client.on(
    Discord.Events.GuildMemberAdd,
    async (member: Discord.GuildMember) => {
      await sendEvent("guildMemberAdd", {
        member: member.toJSON(),
        user: member.user.toJSON(),
        guild: member.guild.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildMemberRemove,
    async (member: Discord.GuildMember | Discord.PartialGuildMember) => {
      if (member instanceof Discord.GuildMember) {
        await sendEvent("guildMemberRemove", {
          member: member.toJSON(),
          user: member.user.toJSON(),
          guild: member.guild.toJSON(),
        });
      } else {
        console.warn("PartialGuildMember received for GuildMemberRemove event");
      }
    }
  );

  client.on(
    Discord.Events.GuildMemberUpdate,
    async (
      oldMember: Discord.GuildMember | Discord.PartialGuildMember,
      newMember: Discord.GuildMember
    ) => {
      await sendEvent("guildMemberUpdate", {
        oldMember:
          oldMember instanceof Discord.GuildMember ? oldMember.toJSON() : null,
        newMember: newMember.toJSON(),
        guild: newMember.guild.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildMemberAvailable,
    async (member: Discord.GuildMember | Discord.PartialGuildMember) => {
      if (member instanceof Discord.GuildMember) {
        await sendEvent("guildMemberAvailable", {
          member: member.toJSON(),
          user: member.user.toJSON(),
          guild: member.guild.toJSON(),
        });
      } else {
        console.warn(
          "PartialGuildMember received for GuildMemberAvailable event"
        );
      }
    }
  );

  // User Events
  client.on(
    Discord.Events.UserUpdate,
    async (
      oldUser: Discord.User | Discord.PartialUser,
      newUser: Discord.User
    ) => {
      await sendEvent("userUpdate", {
        oldUser: oldUser instanceof Discord.User ? oldUser.toJSON() : null,
        newUser: newUser.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.PresenceUpdate,
    async (
      oldPresence: Discord.Presence | null,
      newPresence: Discord.Presence
    ) => {
      await sendEvent("presenceUpdate", {
        oldPresence: oldPresence?.toJSON() || null,
        newPresence: newPresence.toJSON(),
        user: newPresence.user?.toJSON(),
        guild: newPresence.guild?.toJSON(),
        member: newPresence.member?.toJSON(),
      });
    }
  );

  // Voice Events
  client.on(
    Discord.Events.VoiceStateUpdate,
    async (oldState: Discord.VoiceState, newState: Discord.VoiceState) => {
      await sendEvent("voiceStateUpdate", {
        oldState: {
          channel: oldState.channel?.toJSON(),
        },
        newState: {
          channel: newState.channel?.toJSON(),
        },
        guild: newState.guild.toJSON(),
        member: newState.member?.toJSON(),
        user: newState.member?.user.toJSON(),
      });
    }
  );

  // Channel Events
  client.on(Discord.Events.ChannelCreate, async (channel: Discord.Channel) => {
    if (!channel.isTextBased()) return;
    await sendEvent("channelCreate", {
      channel: channel.toJSON(),
      guild: "guild" in channel ? channel.guild.toJSON() : null,
    });
  });

  client.on(
    Discord.Events.ChannelUpdate,
    async (oldChannel: Discord.Channel, newChannel: Discord.Channel) => {
      if (!newChannel.isTextBased()) return;
      await sendEvent("channelUpdate", {
        oldChannel: oldChannel.toJSON(),
        newChannel: newChannel.toJSON(),
        guild: "guild" in newChannel ? newChannel.guild.toJSON() : null,
      });
    }
  );

  client.on(Discord.Events.ChannelDelete, async (channel: Discord.Channel) => {
    if (!channel.isTextBased()) return;
    await sendEvent("channelDelete", {
      channel: channel.toJSON(),
      guild: "guild" in channel ? channel.guild.toJSON() : null,
    });
  });

  client.on(
    Discord.Events.ThreadCreate,
    async (thread: Discord.ThreadChannel) => {
      await sendEvent("threadCreate", {
        thread: thread.toJSON(),
        guild: thread.guild.toJSON(),
        parent: thread.parent?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.ThreadUpdate,
    async (
      oldThread: Discord.ThreadChannel,
      newThread: Discord.ThreadChannel
    ) => {
      await sendEvent("threadUpdate", {
        oldThread: oldThread.toJSON(),
        newThread: newThread.toJSON(),
        guild: newThread.guild.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.ThreadDelete,
    async (thread: Discord.ThreadChannel) => {
      await sendEvent("threadDelete", {
        thread: thread.toJSON(),
        guild: thread.guild.toJSON(),
      });
    }
  );

  // Disabled for erros with BigInt

  // // Interaction Events
  // client.on(Discord.Events.InteractionCreate, async (interaction: Discord.Interaction) => {
  //     if (!interaction.guild || interaction.user.bot) return;

  //     const data: any = {
  //         interaction: interaction.toJSON(),
  //         guild: interaction.guild.toJSON(),
  //         channel: interaction.channel?.toJSON(),
  //         user: interaction.user.toJSON()
  //     };

  //     if (interaction.isCommand() || interaction.isContextMenuCommand() || interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
  //         data.member = interaction.member
  //     }

  //     await sendEvent('interactionCreate', data);
  // });

  // Role Events
  client.on(Discord.Events.GuildRoleCreate, async (role: Discord.Role) => {
    await sendEvent("guildRoleCreate", {
      role: role.toJSON(),
      guild: role.guild.toJSON(),
    });
  });

  client.on(
    Discord.Events.GuildRoleUpdate,
    async (oldRole: Discord.Role, newRole: Discord.Role) => {
      await sendEvent("guildRoleUpdate", {
        oldRole: oldRole.toJSON(),
        newRole: newRole.toJSON(),
        guild: newRole.guild.toJSON(),
      });
    }
  );

  client.on(Discord.Events.GuildRoleDelete, async (role: Discord.Role) => {
    await sendEvent("guildRoleDelete", {
      role: role.toJSON(),
      guild: role.guild.toJSON(),
    });
  });

  // Emoji Events
  client.on(
    Discord.Events.GuildEmojiCreate,
    async (emoji: Discord.GuildEmoji) => {
      await sendEvent("guildEmojiCreate", {
        emoji: emoji.toJSON(),
        guild: emoji.guild.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildEmojiUpdate,
    async (oldEmoji: Discord.GuildEmoji, newEmoji: Discord.GuildEmoji) => {
      await sendEvent("guildEmojiUpdate", {
        oldEmoji: oldEmoji.toJSON(),
        newEmoji: newEmoji.toJSON(),
        guild: newEmoji.guild.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildEmojiDelete,
    async (emoji: Discord.GuildEmoji) => {
      await sendEvent("guildEmojiDelete", {
        emoji: emoji.toJSON(),
        guild: emoji.guild.toJSON(),
      });
    }
  );

  // Ban Events
  client.on(Discord.Events.GuildBanAdd, async (ban: Discord.GuildBan) => {
    await sendEvent("guildBanAdd", {
      ban: {
        reason: ban.reason,
        user: ban.user.toJSON(),
      },
      guild: ban.guild.toJSON(),
    });
  });

  client.on(Discord.Events.GuildBanRemove, async (ban: Discord.GuildBan) => {
    await sendEvent("guildBanRemove", {
      user: ban.user.toJSON(),
      guild: ban.guild.toJSON(),
    });
  });

  // Invite Events
  client.on(Discord.Events.InviteCreate, async (invite: Discord.Invite) => {
    await sendEvent("inviteCreate", {
      invite: invite.toJSON(),
      guild: invite.guild?.toJSON(),
      channel: invite.channel?.toJSON(),
      inviter: invite.inviter?.toJSON(),
    });
  });

  client.on(Discord.Events.InviteDelete, async (invite: Discord.Invite) => {
    await sendEvent("inviteDelete", {
      invite: invite.toJSON(),
      guild: invite.guild?.toJSON(),
      channel: invite.channel?.toJSON(),
    });
  });

  // Webhook Events
  client.on(
    Discord.Events.WebhooksUpdate,
    async (
      channel:
        | Discord.TextChannel
        | Discord.NewsChannel
        | Discord.VoiceChannel
        | Discord.ForumChannel
        | Discord.MediaChannel
    ) => {
      if (channel instanceof Discord.TextChannel) {
        await sendEvent("webhooksUpdate", {
          channel: channel.toJSON(),
          guild: channel.guild.toJSON(),
        });
      }
    }
  );

  // Stage Instance Events
  client.on(
    Discord.Events.StageInstanceCreate,
    async (stageInstance: Discord.StageInstance) => {
      await sendEvent("stageInstanceCreate", {
        stageInstance: stageInstance.toJSON(),
        guild: stageInstance.guild?.toJSON(),
        channel: stageInstance.channel?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.StageInstanceUpdate,
    async (
      oldStageInstance: Discord.StageInstance | null,
      newStageInstance: Discord.StageInstance
    ) => {
      await sendEvent("stageInstanceUpdate", {
        oldStageInstance: oldStageInstance?.toJSON() || null,
        newStageInstance: newStageInstance.toJSON(),
        guild: newStageInstance.guild?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.StageInstanceDelete,
    async (stageInstance: Discord.StageInstance) => {
      await sendEvent("stageInstanceDelete", {
        stageInstance: stageInstance.toJSON(),
        guild: stageInstance.guild?.toJSON(),
      });
    }
  );

  // Scheduled Event Events
  client.on(
    Discord.Events.GuildScheduledEventCreate,
    async (event: Discord.GuildScheduledEvent) => {
      await sendEvent("guildScheduledEventCreate", {
        event: event.name ? event.toJSON() : null,
        guild: event.guild?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildScheduledEventUpdate,
    async (
      oldEvent:
        | Discord.GuildScheduledEvent
        | Discord.PartialGuildScheduledEvent
        | null,
      newEvent: Discord.GuildScheduledEvent
    ) => {
      await sendEvent("guildScheduledEventUpdate", {
        oldEvent: oldEvent ? oldEvent.toJSON() : null,
        newEvent: newEvent.toJSON(),
        guild: newEvent.guild?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildScheduledEventDelete,
    async (
      event: Discord.GuildScheduledEvent | Discord.PartialGuildScheduledEvent
    ) => {
      await sendEvent("guildScheduledEventDelete", {
        event: event.toJSON(),
        guild: event.guild?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildScheduledEventUserAdd,
    async (
      event: Discord.GuildScheduledEvent | Discord.PartialGuildScheduledEvent,
      user: Discord.User
    ) => {
      await sendEvent("guildScheduledEventUserAdd", {
        event: event.toJSON(),
        user: user.toJSON(),
        guild: event.guild?.toJSON(),
      });
    }
  );

  client.on(
    Discord.Events.GuildScheduledEventUserRemove,
    async (
      event: Discord.GuildScheduledEvent | Discord.PartialGuildScheduledEvent,
      user: Discord.User
    ) => {
      await sendEvent("guildScheduledEventUserRemove", {
        event: event.name ? event.toJSON() : null,
        user: user.toJSON(),
        guild: event.guild?.toJSON(),
      });
    }
  );

  // Other Events
  client.on(Discord.Events.TypingStart, async (typing: Discord.Typing) => {
    await sendEvent("typingStart", {
      typing: {
        channelId: typing.channel.id,
        userId: typing.user.id,
        timestamp: typing.startedTimestamp,
        guildId: typing.guild?.id,
        member: typing.member?.toJSON(),
      },
      user: typing.user.toJSON(),
      channel: typing.channel?.toJSON(),
      guild: typing.guild?.toJSON(),
    });
  });
  Logger.info({
    timestamp: new Date().toISOString(),
    level: "info",
    label: "EventsAPI",
    message: `EventsAPI is ready!`,
    botType: Config.BotType.toString() || "Unknown",
    action: LoggingAction.Other,
  });
}
