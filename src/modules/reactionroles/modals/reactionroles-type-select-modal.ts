import {
    ActionRow,
    ActionRowBuilder,
    ComponentType,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    TextChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-type-select-modal",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        // Fetch the reaction role data
        const reactData = await database.reactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });
        if (!client.user) throw new Error("Client user is not cached");
        if (!reactData) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No data found.`,
                flags: MessageFlags.Ephemeral
            });
        }

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
                    SelectMenu: {
                        Emoji:
                            interaction.fields.getTextInputValue(
                                "reactionroles-type-select-emoji"
                            ) ?? null,
                        Label:
                            interaction.fields.getTextInputValue(
                                "reactionroles-type-select-label"
                            ) ?? null,
                        Description:
                            interaction.fields.getTextInputValue(
                                "reactionroles-type-select-description"
                            ) ?? null
                    }
                }
            }
        );

        const channel = await interaction.guild?.channels.fetch(
            reactData.ChannelId as string
        );
        const message = await (channel as TextChannel)?.messages.fetch(
            reactData.MessageId as string
        );

        if (!message) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Message not found.`,
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            // Check existing components
            const existingComponents = message.components;
            let currentSelectMenu = null;
            let rowIndex = null;

            for (const [i, row] of existingComponents.entries()) {
                for (const component of (row as ActionRow<MessageActionRowComponent>).components) {
                    if (
                        component.type === ComponentType.StringSelect &&
                        component.customId?.includes("reactionroles-selectmenu")
                    ) {
                        currentSelectMenu = component;
                        rowIndex = i;
                        break;
                    }
                }
            }

            // Create new option
            const newOption = {
                label: interaction.fields.getTextInputValue(
                    "reactionroles-type-select-label"
                ),
                value: uuid,
                emoji: interaction.fields.getTextInputValue(
                    "reactionroles-type-select-emoji"
                )
                    ? {
                        name: interaction.fields.getTextInputValue(
                            "reactionroles-type-select-emoji"
                        )
                    }
                    : undefined,
                description: interaction.fields.getTextInputValue(
                    "reactionroles-type-select-description"
                )
                    ? interaction.fields.getTextInputValue(
                        "reactionroles-type-select-description"
                    )
                    : undefined
            };

            if (currentSelectMenu) {
                // Extract options and add the new one
                const existingOptions = currentSelectMenu.options.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                    emoji: opt.emoji,
                    description: opt.description
                }));

                if (existingOptions.length < 25) {
                    existingOptions.push(newOption);

                    const updatedMenu = new StringSelectMenuBuilder()
                        .setCustomId(currentSelectMenu.customId)
                        .setPlaceholder(
                            currentSelectMenu.placeholder ?? "Select Reaction Role"
                        )
                        .setMinValues(currentSelectMenu.minValues ?? 1)
                        .setMaxValues(currentSelectMenu.maxValues ?? 1)
                        .addOptions(existingOptions);

                    if (rowIndex !== null) {
                        existingComponents[rowIndex] =
                            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                updatedMenu
                            ) as unknown as ActionRow<MessageActionRowComponent>;
                    }
                } else {
                    // Create a new SelectMenu if full
                    const newSelectMenu = new StringSelectMenuBuilder()
                        .setCustomId(`reactionroles-selectmenu:${uuid}`)
                        .setPlaceholder(
                            interaction.fields.getTextInputValue(
                                "reactionroles-type-select-placeholder"
                            ) ?? "Select Reaction Role"
                        )
                        .setMinValues(0)
                        .setMaxValues(1)
                        .addOptions(newOption);

                    existingComponents.push(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            newSelectMenu
                        ) as unknown as ActionRow<MessageActionRowComponent>
                    );
                }
            } else {
                // No existing menu, create a new one
                const newSelectMenu = new StringSelectMenuBuilder()
                    .setCustomId(`reactionroles-selectmenu:${uuid}`)
                    .setPlaceholder(
                        interaction.fields.getTextInputValue(
                            "reactionroles-type-select-placeholder"
                        ) ?? "Select Reaction Role"
                    )
                    .setMinValues(0)
                    .setMaxValues(1)
                    .addOptions(newOption);

                existingComponents.push(
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        newSelectMenu
                    ) as unknown as ActionRow<MessageActionRowComponent>
                );
            }

            // Update the message with the updated components
            await message.edit({
                components: existingComponents
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while updating the message.`,
                flags: MessageFlags.Ephemeral
            });
        }
        // Respond to the interaction
        return interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Reaction Role SelectMenu updated successfully.`,
            flags: MessageFlags.Ephemeral
        });
    }
};
