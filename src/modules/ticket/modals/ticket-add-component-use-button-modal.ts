import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder, Message,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder, TextBasedChannel,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiGif, convertToEmojiPng} from "../../../helper/emojis.js";
import {errorHandler} from "../../../helper/errorHelper.js";

export default {
    id: "ticket-add-component-use-button-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const messageUrl = interaction.fields.getTextInputValue(
            "messageurl"
        ).split("/")
        const messageId = messageUrl[6]
        const channelId = messageUrl[5]

        const nameInput = interaction.fields.getTextInputValue(
            "name"
        );
        const emojiInput = interaction.fields.getTextInputValue(
            "emoji"
        );
        const style = interaction.fields.getTextInputValue(
            "style"
        );
        let channel: TextBasedChannel;
        let message: Message
        try {
            channel = await interaction.guild.channels.fetch(channelId) as TextBasedChannel
            message = await channel?.messages.fetch(messageId);
            if (!message) {
                const error = new Error("The Bot can't fetch the Message from your URL");
                return await errorHandler(
                    interaction,
                    client,
                    error,
                    "Please check your Message Url",
                    "The input of the message url can't be fetched!"
                );
            }
        } catch (e) {
            const error = new Error("Error while fetching message url");
            return await errorHandler(
                interaction,
                client,
                error,
                "Please check your Message Url",
                "The input of the message url can't be fetched!"
            );
        }
        const uuid = interaction.customId.split(":")[1];

        // Map styles
        let styles: number;
        if (style == "Primary") styles = 1;
        else if (style == "Secondary") styles = 2;
        else if (style == "Success") styles = 3;
        else if (style == "Danger") styles = 4;
        else styles = 3;

        let rows = message?.components as ActionRow<MessageActionRowComponent>[];

        const maxComponentsPerRow = 5;
        const maxRows = 5;

        if (!rows) rows = [];

        if (rows.length === 0) {
            const button = new ButtonBuilder()
                .setCustomId("ticket-create-button:" + uuid)
                .setLabel(nameInput)
                .setStyle(styles || ButtonStyle.Secondary);

            if (emojiInput) {
                button.setEmoji(emojiInput);
            }

            const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button
            );

            await message?.edit({components: [newRow]});
        } else {
            let lastRow = rows[rows.length - 1];

            if (lastRow.components.length >= maxComponentsPerRow) {
                if (rows.length >= maxRows) {
                    return await interaction.editReply({
                        content:
                            "Cannot add more buttons. The message has reached the maximum number of rows and components.",
                    });
                }
                const button = new ButtonBuilder()
                    .setCustomId("ticket-create-button:" + uuid)
                    .setLabel(nameInput)
                    .setStyle(styles || ButtonStyle.Secondary);

                if (emojiInput) {
                    button.setEmoji(emojiInput);
                }

                const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    button
                );
                rows.push(newRow as unknown as ActionRow<MessageActionRowComponent>);
            } else {
                const button = new ButtonBuilder()
                    .setCustomId("ticket-create-button:" + uuid)
                    .setLabel(nameInput)
                    .setStyle(styles || ButtonStyle.Secondary);

                if (emojiInput) {
                    button.setEmoji(emojiInput);
                }

                lastRow.components.push(button as unknown as MessageActionRowComponent);
            }

            await message?.edit({components: rows});
        }

        await interaction.reply({
            content: `## ${await convertToEmojiPng("ticket", client.user.id)} Added Component to your Message ${message.url}`,
            flags: MessageFlags.Ephemeral,
        })
    },
}
;
