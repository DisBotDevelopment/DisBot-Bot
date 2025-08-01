import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ContainerBuilder, ContainerComponent, EmbedBuilder, FileBuilder, Message, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder, UserSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { log } from "winston";

export default {
    id: "messages-embed-exportfile",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ButtonInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[2];
        const messageId = interaction.customId.split(":")[1];
        const message = await interaction.channel?.messages.fetch(messageId);


        if (!interaction.channel?.isTextBased()) {
            return interaction.reply({
                content: "This channel is not sendable.",
                ephemeral: true,
            });
        }

        if (!client.user) throw new Error("No Client")
        if (!interaction.channel.isSendable()) return interaction.reply({ content: `## ${await convertToEmojiPng("error", client.user?.id)} This channel not supports message sending!` })


        const buffer = Buffer.from(JSON.stringify(message?.embeds[0].toJSON()));

        const addRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`embed-create-add-sec:${messageId}`)
                .setPlaceholder("➕ Add a Option to the Embed")
                .addOptions(
                    {
                        label: "Title",
                        value: "title",
                        description: "Set the Title of the Embed",
                        emoji: "<:heading:1321937110151729153>",
                    },
                    {
                        label: "Author",
                        value: "author",
                        description: "Set the Author of the Embed",
                        emoji: "<:userdetail:1321937833296134205>",
                    },
                    {
                        label: "Footer",
                        value: "footer",
                        description: "Set the Footer of the Embed",
                        emoji: "<:subtitle:1321938231788568586>",
                    },
                    {
                        label: "Description",
                        value: "description",
                        description: "Set the Description of the Embed",
                        emoji: "<:description:1321938426576109768>",
                    },
                    {
                        label: "Color",
                        value: "color",
                        description: "Set the Color of the Embed",
                        emoji: "<:color:1321938714741440552>",
                    },
                    {
                        label: "Thumbnail",
                        value: "thumbnail",
                        description: "Set the Thumbnail of the Embed",
                        emoji: "<:imageadd:1260148502449754112>",
                    },
                    {
                        label: "Timestamp",
                        value: "timestamp",
                        description: "Set the Timestamp of the Embed",
                        emoji: "<:timer:1321939051921801308>",
                    },
                    {
                        label: "Image",
                        value: "image",
                        description: "Set the Image of the Embed",
                        emoji: "<:imageadd:1260148502449754112>",
                    },
                    {
                        label: "Field",
                        value: "field",
                        description: "Manage the Fields of the Embed",
                        emoji: "<:folder:1321939544521572384>",
                    }
                )
        );

        const deleteRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`embed-create-delete-sec:${messageId}`)
                .setPlaceholder("➖ Remove a Option from the Embed")
                .addOptions(
                    {
                        label: "Title",
                        value: "title",
                        description: "Remove the Title from the Embed",
                        emoji: "<:heading:1321937110151729153>",
                    },
                    {
                        label: "Author",
                        value: "author",
                        description: "Remove the Author from the Embed",
                        emoji: "<:userdetail:1321937833296134205>",
                    },
                    {
                        label: "Footer",
                        value: "footer",
                        description: "Remove the Footer from the Embed",
                        emoji: "<:subtitle:1321938231788568586>",
                    },
                    {
                        label: "Description",
                        value: "description",
                        description: "Remove the Description from the Embed",
                        emoji: "<:description:1321938426576109768>",
                    },
                    {
                        label: "Color",
                        value: "color",
                        description: "Remove the Color from the Embed",
                        emoji: "<:color:1321938714741440552>",
                    },
                    {
                        label: "Thumbnail",
                        value: "thumbnail",
                        description: "Remove the Thumbnail from the Embed",
                        emoji: "<:imageadd:1260148502449754112>",
                    },
                    {
                        label: "Timestamp",
                        value: "timestamp",
                        description: "Remove the Timestamp from the Embed",
                        emoji: "<:timer:1321939051921801308>",
                    },
                    {
                        label: "Image",
                        value: "image",
                        description: "Remove the Image from the Embed",
                        emoji: "<:imageadd:1260148502449754112>",
                    },
                    {
                        label: "Field",
                        value: "field",
                        description: "Remove the Fields from the Embed",
                        emoji: "<:folder:1321939544521572384>",
                    }
                )
        );

        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`embed-create-import:${messageId}`)
                .setLabel("Import JSON")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("<:import:1321939860868698185>"),
            new ButtonBuilder()
                .setCustomId(`messages-embed-create-save:${uuid}:${messageId}`)
                .setLabel("Save the Embed")
                .setStyle(ButtonStyle.Success)
                .setEmoji("<:save:1260157401496031244>"),
            new ButtonBuilder()
                .setCustomId(`messages-embed-exportfile:${messageId}:${uuid}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:save:1260140823106813953>"),
            new ButtonBuilder()
                .setCustomId(`messages-embed-clearmessage:${messageId}`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji("<:message:1322252985702551767>")
        );

        await interaction.update({
            withResponse: true,
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            files: [new AttachmentBuilder(buffer, { name: `embed-${uuid}.json` })],
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(addRow)
                    .addActionRowComponents(deleteRow)
                    .addActionRowComponents(buttonRow)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `**Use the ${await convertToEmojiPng("message", client.user.id)} button to clear the message from the channel**\n-# To Export the Embed as JSON File use the ${await convertToEmojiPng("refresh", client.user.id)} button below.\n-# To Import a JSON File use the ${await convertToEmojiPng("import", client.user.id)} button.`
                        )
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://embed-${uuid}.json`)
                    ),
            ],
        });
    }
};