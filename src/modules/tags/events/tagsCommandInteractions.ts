import { Events, GuildMember, Interaction, MessageFlags } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { database } from "../../../main/database.js";

/**
 * @param {ExtendedClient} client
 * @param {fs} fs
 */
export default {
    name: Events.InteractionCreate,

    async execute(interaction: Interaction, client: ExtendedClient, fs: any) {
        if (!interaction.isChatInputCommand()) return;

        const commandID = interaction.commandId;

        const tag = await database.tags.findFirst({
            where: {
                GuildId: interaction.guildId,
                ShlashCommandId: commandID
            }
        });

        if (!tag) return;

        if (tag.ShlashCommandId == commandID) {
            if (tag.IsEnabled == false) return;

            if (tag.PermissionRoleId) {
                if (
                    !interaction.member ||
                    !(interaction.member as GuildMember).roles.cache.has(
                        tag.PermissionRoleId
                    )
                ) {
                    return interaction.reply({
                        content: `## ${await convertToEmojiPng(
                            "tag",
                            client.user?.id ?? "unknown"
                        )} You do not have the permission to use this tag.`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }

            const messageData = await database.messageTemplates.findFirst({
                where: {
                    Name: tag.MessageId
                }
            });
            if (!client.user) return;

            if (!messageData)
                return interaction.reply({
                    content: `## ${await convertToEmojiPng(
                        "tag",
                        client.user.id
                    )} No message found.`,
                    flags: MessageFlags.Ephemeral
                });

            if (!messageData) return;

            if (messageData.EmbedJSON) {
                interaction.reply({
                    content: messageData.Content ?? "",
                    embeds: [JSON.parse(messageData.EmbedJSON)]
                });
            } else {
                interaction.reply({
                    content: messageData.Content ?? ""
                });
            }
        }
    }
};
