import {
    Events,
    MessageReaction,
    MessageReactionEventDetails,
    User,
    GuildMember
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {verifyAction} from "../../../systems/verifictionAction.js";
import {VerificationAction} from "../../../enums/verification.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.MessageReactionRemove, // Wenn du ReactionRemove meinst – sonst zu MessageReactionAdd ändern

    /**
     * @param {MessageReaction} reaction - The reaction that was removed.
     * @param {User} user - The user who removed the reaction.
     * @param {MessageReactionEventDetails} details - Additional details.
     * @param {ExtendedClient} client - The client instance.
     */
    async execute(
        reaction: MessageReaction,
        user: User,
        details: MessageReactionEventDetails,
        client: ExtendedClient
    ) {
        const messageId = reaction.message.id;
        const channelId = reaction.message.channel.id;

        const data = await database.verificationGates.findFirst({
            where: {
                ChannelId: channelId,
                MessageId: messageId
            }
        });

        if (!data || data.Active === false) return;

        if (!reaction.message.guildId) return;

        const guild = await client.guilds.fetch(reaction.message.guildId);
        const member = await guild.members.fetch(user.id).catch(() => null);

        if (!member) return;

        await verifyAction(
            member,
            data.Action as VerificationAction,
            data.UUID as string
        );
    },
};
