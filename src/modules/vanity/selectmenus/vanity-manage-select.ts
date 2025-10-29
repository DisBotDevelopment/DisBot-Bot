import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuInteraction, TextDisplayBuilder, TextDisplayComponent
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

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

            if (!data) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This vanity URL is not found.`, interaction, true, "deferReply")
            }

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
                    .setEmoji("<:link:1321941111090057248>"),
                new ButtonBuilder()
                    .setLabel("Open Vanity URL")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://dchat.link/${data?.Slug}`)
                    .setEmoji("<:externallink:1376666845309829160>")
            );

            await interaction.editReply({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    [
                                        `## ${await convertToEmojiToPng("link")} Manage your vanity URL's`,
                                        ``,
                                        `${await convertToEmojiToPng("link")} **Vanity**: \`${data?.Slug}\``,
                                        `${await convertToEmojiToPng("status")} **Host**: \`${data?.Host}\``,
                                        `${await convertToEmojiToPng("group")} **Guild**: ${await client.guilds.fetch(data?.GuildId as string).then(g => g.name)} (\`${data?.GuildId}\`)`,
                                        `${await convertToEmojiToPng("link")} **Invite**: [Invite](${data?.Invite})`,
                                        `${await convertToEmojiToPng("link")} **Vanity-Link**: [Vanity Link](https://dchat.link/${data?.Slug})`,
                                        `${await convertToEmojiToPng("uuid")} **UUID**: ${data?.UUID}`
                                    ].join("\n")
                                )
                        )
                        .addActionRowComponents(row)
                ],
            });
        }
    }
};
