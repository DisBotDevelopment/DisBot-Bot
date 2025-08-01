import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-manage-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {
            const data = await database.vanitys.findFirst({
                where: {
                    UUID: value
                }
            });

            await interaction.deferReply(
                {flags: MessageFlags.Ephemeral}
            )

            if (!client.user) throw new Error("Client is not ready");

            if (!data) {
                await interaction.editReply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
                });
            }

            const embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription(
                    [
                        `## ${await convertToEmojiPng("link", client.user.id)} Manage your vanity URL's`,
                        ``,
                        `${await convertToEmojiPng("link", client.user.id)} **Vanity**: \`${data?.Slug}\``,
                        `${await convertToEmojiPng("status", client.user.id)} **Host**: \`${data?.Host}\``,
                        `${await convertToEmojiPng("group", client.user.id)} **Guild**: ${await client.guilds.fetch(data?.GuildId as string).then(g => g.name)} (\`${data?.GuildId}\`)`,
                        `${await convertToEmojiPng("link", client.user.id)} **Invite**: [Invite](${data?.Invite})`,
                        `${await convertToEmojiPng("link", client.user.id)} **Vanity-Link**: [Vanity Link](https://dchat.click/${data?.Slug})`,
                        `${await convertToEmojiPng("uuid", client.user.id)} **UUID**: \`\`\`${data?.UUID}\`\`\``
                    ].join("\n")
                );

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel("Delete Vanity URL")
                    .setCustomId(`vanity-delete:${data?.UUID}`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("<:trash:1259432932234367069>"),
                new ButtonBuilder()
                    .setLabel("View Analytics")
                    .setCustomId(`vanity-analytics:${data?.UUID}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:view:1376316872345260032>"),
                new ButtonBuilder()
                    .setLabel("Edit Vanity URL")
                    .setCustomId(`vanity-edit:${data?.UUID}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:edit:1259961121075626066>"),
                new ButtonBuilder()
                    .setLabel("Open Vanity URL")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://dchat.link/${data?.Slug}`)
                    .setEmoji("<:externallink:1376666845309829160>")
            );

            await interaction.editReply({
                embeds: [embed],
                components: [row],
            });
        }
    }
};
