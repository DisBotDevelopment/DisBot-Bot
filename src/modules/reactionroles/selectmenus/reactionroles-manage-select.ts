import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: Client) {
        for (const uuid of interaction.values) {
            const guildId = interaction.guild?.id;

            const nextEmbed = await database.reactionRoles.findFirst({
                where: {
                    GuildId: guildId,
                    UUID: uuid
                }
            });

            if (!nextEmbed) {
                if (!client.user) throw new Error("Client user is not defined");
                interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} The reaction-role with the UUID \`${uuid}\` does not exist`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const embedMessage = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription(
                    [
                        `**Label**: \`${nextEmbed?.Emoji ? nextEmbed.Emoji : nextEmbed.Button?.Label ? nextEmbed.Button?.Label : nextEmbed.SelectMenu?.Label}\``,
                        `**Type**: \`${nextEmbed.Emoji ? "Emoji" : nextEmbed.Button?.Label ? "Button" : "Select Menu"}\``,
                        `**Roles**: <@&${nextEmbed.Roles?.join(">, <@&")}>`,
                        `**UUID**: \`\`\`${nextEmbed.UUID}\`\`\``,
                        `**AddMessageID**: \`${nextEmbed.AddMessage ? nextEmbed.AddMessage : "None"}\``,
                        `**RemoveMessageID**: \`${nextEmbed.RemoveMessage ? nextEmbed.RemoveMessage : "None"}\``
                    ].join("\n")
                );

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:edit:1259961121075626066>")
                    .setLabel("Edit the Reaction Role")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("reactionrole-manage-edit:" + nextEmbed.UUID),
                new ButtonBuilder()
                    .setEmoji("<:addchannel:1324458759589728387>")
                    .setLabel("Use the Reaction Role")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("reactionrole-manage-add:" + nextEmbed.UUID),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete the Reaction Role")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("reactionroles-manage-delete:" + nextEmbed.UUID)
            );
            await interaction.reply({
                embeds: [embedMessage],
                components: [row],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
