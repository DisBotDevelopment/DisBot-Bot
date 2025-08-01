import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    TextDisplayBuilder,
    TextInputBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";
import {database} from "../../../main/database.js";

export default {
    id: "message-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const uuid of interaction.values) {
            if (!interaction.guild) throw new Error("No Guild found.");
            const guildId = interaction.guild.id;

            const nextEmbed = await database.messageTemplates.findFirst({
                where: {
                    Name: uuid
                }
            });
            if (!nextEmbed) {
                if (!client.user) throw new Error("No Client User found.");
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No message template found with UUID: ${uuid}`,
                    flags: MessageFlags.Ephemeral
                });
            }

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:setting:1260156922569687071>")
                    .setLabel("Message Settings")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("messages-setting:" + nextEmbed.Name),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete Template")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("messages-delete:" + nextEmbed.Name),
                new ButtonBuilder()
                    .setEmoji("<:send:1288224549078434012>")
                    .setLabel("Send Message")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("messages-send:" + nextEmbed.Name)
            );
            await interaction.reply({
                components: [

                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder().setContent([`**Template Name**: \`${nextEmbed.Name}\``,
                            `**UUID**: \`\`\`${nextEmbed.Name}\`\`\``].join("\n"))
                    ).addActionRowComponents(row),

                ],
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            });
        }
    }
};
