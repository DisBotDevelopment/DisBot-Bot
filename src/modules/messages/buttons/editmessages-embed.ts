import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    EmbedBuilder,
    FileBuilder, Message,
    MessageFlags,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "editmessages-embed",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const messageId = interaction.customId.split(":")[1]
        const embedId = interaction.customId.split(":")[2]
        const message = await interaction.channel.messages.fetch(messageId);
        const embed = message.embeds[Number(embedId)]

        if (!client.user) throw new Error("No Client")
        if (!interaction.channel.isSendable() || !interaction.channel?.isTextBased()) return interaction.reply({content: `## ${await convertToEmojiToPng("error")} This channel not supports message sending!`})


        const buffer = Buffer.from(JSON.stringify(embed.toJSON()));

        const addRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`embed-create-add-sec:${messageId}:${embedId}`)
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
                .setCustomId(`embed-create-delete-sec:${messageId}:${embedId}`)
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
                .setCustomId(`editmessages-embed-exportfile:${messageId}:${embedId}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:save:1260140823106813953>"),
        );

        await interaction.reply({
            withResponse: true,
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            files: [new AttachmentBuilder(buffer, {name: `embed-${messageId}.json`})],
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(addRow)
                    .addActionRowComponents(deleteRow)
                    .addActionRowComponents(buttonRow)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `${await convertToEmojiToPng("info")} **__You now live edit your Embed!__**\n-# To Export the Embed as JSON File use the ${await convertToEmojiToPng("refresh")} button below.\n-# To Import a JSON File use the ${await convertToEmojiToPng("import")} button.`
                        )
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://embed-${messageId}.json`)
                    ),
            ],
        });

    },
};
