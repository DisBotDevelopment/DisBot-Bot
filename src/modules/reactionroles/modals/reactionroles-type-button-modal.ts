import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ComponentType,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction,
    TextChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-type-button-modal",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const style = interaction.fields.getTextInputValue(
            "reactionroles-type-button-style"
        );
        let styleId = 0;

        if (style == "Danger") styleId = 4;
        if (style == "Primary") styleId = 1;
        if (style == "Secondary") styleId = 2;
        if (style == "Success") styleId = 3;

        const reactData = await database.reactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (
            reactData?.Button?.Type ||
            reactData?.SelectMenu?.Label ||
            reactData?.Emoji
        ) {
            if (!client.user) throw new Error("Client user is not cached");
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You have already set a type for this reaction role`,
                components: [],
                flags: MessageFlags.Ephemeral
            });
        }

        await database.reactionRoles.update(
            {
                where: {UUID: uuid},
                data: {
                    Button: {
                        Label: interaction.fields.getTextInputValue(
                            "reactionroles-type-button-label"
                        )
                            ? interaction.fields.getTextInputValue(
                                "reactionroles-type-button-label"
                            )
                            : null,
                        Emoji: interaction.fields.getTextInputValue(
                            "reactionroles-type-button-emoji"
                        ),
                        Type: styleId.toString(),
                    }
                }
            }
        );

        const data = await database.reactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (!client.user) throw new Error("Client user is not cached");
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No data found`,
                flags: MessageFlags.Ephemeral
            });
        }

        const channel = await interaction.guild?.channels.fetch(
            data.ChannelId as string
        );
        const message = await (channel as TextChannel)?.messages.fetch(
            data.MessageId as string
        );

        if (!message) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Message not found.`,
                flags: MessageFlags.Ephemeral
            });
        }

        // Check existing components
        const existingComponents = message.components;
        for (const row of existingComponents as ActionRow<MessageActionRowComponent>[]) {
            for (const component of row.components) {
                if (
                    component.type === ComponentType.StringSelect ||
                    component.type === ComponentType.RoleSelect ||
                    component.type === ComponentType.UserSelect ||
                    component.type === ComponentType.ChannelSelect ||
                    component.type === ComponentType.MentionableSelect
                ) {
                    return interaction.reply({
                        content: `## ${await convertToEmojiPng("error", client.user?.id)} A SelectMenu exists in this message, cannot add buttons.`,
                        flags: MessageFlags.Ephemeral
                    });
                }

                if (!component.customId?.includes("reactionroles-button")) {
                    return interaction.reply({
                        content: `## ${await convertToEmojiPng("error", client.user?.id)} There is already a button not related to Reaction Roles!`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }

        // Create new button
        const newButton = new ButtonBuilder()
            .setCustomId(`reactionroles-button:${uuid}`)
            .setLabel(
                interaction.fields.getTextInputValue("reactionroles-type-button-label")
                    ? interaction.fields.getTextInputValue(
                        "reactionroles-type-button-label"
                    )
                    : "‎"
            )
            .setStyle(styleId)
            .setEmoji(data.Button?.Emoji as string);

        // Add button to existing rows or create a new row
        const updatedComponents = [...existingComponents];
        let added = false;

        for (const row of updatedComponents as ActionRow<MessageActionRowComponent>[]) {
            if (row.components.length < 5) {
                row.components.push(newButton as unknown as MessageActionRowComponent);
                added = true;
                break;
            }
        }

        if (!added) {
            // Create a new row if all existing rows are full
            updatedComponents.push(
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    newButton
                ) as unknown as ActionRow<MessageActionRowComponent>
            );
        }

        // Update the message
        await message.edit({
            components: updatedComponents
        });

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Reaction Role button added successfully.`,
            flags: MessageFlags.Ephemeral
        });
    }
};
