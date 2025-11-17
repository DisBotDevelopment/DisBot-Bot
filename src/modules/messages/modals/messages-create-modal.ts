import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentBuilder,
    ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "messages-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const name = interaction.fields.getTextInputValue("name").replace(/\s+/g, "");

        const data = await database.messageTemplates.findFirst({
            where: {Name: name,}
        });

        if (!client.user) throw new Error("Client user is not cached");

        if (data) {
            return interaction
                .reply({
                    content: `## ${await convertToEmojiToPng(
                        "error"
                    )} This message template already exists.`,
                    flags: MessageFlags.Ephemeral,
                })
                .then(async () => {
                    setTimeout(async () => {
                        await interaction.deleteReply();
                    }, 5000);
                });
        }

        await database.messageTemplates.create({
            data: {
                Guilds: {
                    connect: {
                        GuildId: interaction.guild?.id
                    }
                },
                Name: name,
                IsComponentsV2Message: false,
                Content: "ㅤ",
                EmbedJSON:
                    null,
            }
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("messages-embed-create-embeds:" + name)
                .setLabel("Embeds")
                .setEmoji("<:box:1259853376368148601>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("messages-message-components:" + name)
                .setLabel("Components")
                .setEmoji("<:puzzle:1381000302601441440>")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`## ${await convertToEmojiToPng(
                        "message"
                    )} Created you Message Template.\n-# Choose from the two types Embeds or Components.`)
                ).addActionRowComponents(row),
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    },
};
