import { Events, GuildMember, MessageReaction, MessageReactionEventDetails, User } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { database } from "../../../main/database.js";

export default {
    name: Events.MessageReactionAdd,

    async execute(
        reaction: MessageReaction,
        user: User,
        details: MessageReactionEventDetails,
        client: ExtendedClient
    ) {

        const reactionroles = await database.reactionRoles.findFirst({
            where: {
                Emoji: reaction.emoji.name,
                MessageId: reaction.message.id,
                ChannelId: reaction.message.channelId
            }
        });

        if (!client.user) throw new Error("Client user is not cached");

        if (!reactionroles) {
            return;
        }

        const guild = await client.guilds.fetch(reaction.message.guildId as string);
        const member = (await guild.members.fetch(
            user.id
        )) as unknown as GuildMember;

        if (!member) {
            return
        }

        const addMessageData = await database.messageTemplates.findFirst({
            where: {
                Name: reactionroles.AddMessage ?? ""
            }
        });

        if (!reactionroles.Roles || !Array.isArray(reactionroles.Roles)) {
            throw new Error("Roles are not defined in the reaction role.");
        }
        if (Array.isArray(reactionroles.Roles) && reactionroles.Roles.length > 0) {
            for (const role of reactionroles?.Roles) {
                const guildRole = (
                    await client.guilds.fetch(reaction.message.guildId as string)
                ).roles.cache.get(role);

                if (guildRole) {
                    if (!member.roles.cache.has(guildRole.id)) {
                        try {
                            await (member as GuildMember).roles.add(guildRole);
                        } catch (error) {
                            return;

                        }
                    }
                }
            }
        }
    }
};
