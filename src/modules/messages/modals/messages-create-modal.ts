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
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
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
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
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
                Content: "ㅤ",
                EmbedJSON:
                    null,
            }
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("messages-embed-create:" + name)
                .setLabel("Create Embed")
                .setEmoji("<:box:1259853376368148601>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("messages-message-create:" + name)
                .setLabel("Create Message Content")
                .setEmoji("<:message:1322252985702551767>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("messages-message-save:" + name)
                .setLabel("Save Message Template")
                .setEmoji("<:save:1260157401496031244>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("messages-message-extra-embeds:" + name)
                .setLabel("Add Extra Embeds")
                .setEmoji("<:add:1260157236043583519>")
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`## ${await convertToEmojiPng(
                        "success",
                        client.user.id
                    )} Message template \`\`${name}\`\` created successfully!`)
                ).addActionRowComponents(row),
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    },
};
