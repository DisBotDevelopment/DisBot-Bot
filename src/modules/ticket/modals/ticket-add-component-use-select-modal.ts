import {
    ActionRow,
    ActionRowBuilder,
    AnyComponentBuilder,
    ComponentType, Message,
    MessageActionRowComponent, MessageFlags,
    ModalSubmitInteraction,
    StringSelectMenuBuilder, TextBasedChannel,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {errorHandler} from "../../../helper/errorHelper.js";

export default {
    id: "ticket-add-component-use-select-modal",

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

        const nameinput = interaction.fields.getTextInputValue(
            "name"
        );
        const descriptioninput = interaction.fields.getTextInputValue(
            "description"
        );
        const emojiinput = interaction.fields.getTextInputValue(
            "emoji"
        );
        const placeholder = interaction.fields.getTextInputValue(
            "placeholder"
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

        const newOption = {
            label: nameinput,
            value: uuid,
            description: descriptioninput || undefined,
            emoji: emojiinput || undefined,
        };

        let rows =
            (message.components as ActionRow<MessageActionRowComponent>[]) || [];
        let updatedRows: ActionRowBuilder<AnyComponentBuilder>[] = [];
        let optionAdded = false;

        updatedRows = rows
            .filter((row) =>
                row.components.some(
                    (component) => component.type === ComponentType.StringSelect
                )
            )
            .map((row) => {
                const rowBuilder = ActionRowBuilder.from(
                    row as any
                ) as ActionRowBuilder<StringSelectMenuBuilder>;
                const selectMenu = rowBuilder.components.find(
                    (component) => component instanceof StringSelectMenuBuilder
                ) as StringSelectMenuBuilder;

                if (selectMenu && selectMenu.options.length < 25 && !optionAdded) {
                    selectMenu.addOptions(newOption);
                    optionAdded = true;
                }

                return rowBuilder;
            });

        if (!optionAdded) {
            const newMenu = new StringSelectMenuBuilder()
                .setCustomId(`ticket-create-selectmenu`)
                .setPlaceholder(placeholder || "Select an option")
                .addOptions(newOption);
            const newRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(newMenu);
            updatedRows.push(newRow);
        }

        await message.edit({
            components: updatedRows.map((row) => row.toJSON() as any),
        });

        await interaction.reply({
            content: `## ${await convertToEmojiPng("ticket", client.user.id)} Added Component to your Message ${message.url}`,
            flags: MessageFlags.Ephemeral,
        })
    },
};
