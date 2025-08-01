import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    MessageActionRowComponent,
    MessageFlags,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    TextChannel
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionrole-manage-add-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const handleError = async (error: any, userMessage: any) => {
            if (!client.user) throw new Error("Client user is not defined");
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} ${userMessage}`,
                flags: MessageFlags.Ephemeral
            });
        };

        try {
            const messageURL = interaction.fields.getTextInputValue(
                "reactionrole-manage-add-message"
            );

            const channel = interaction.guild?.channels.cache.get(
                messageURL.split("/")[5]
            ) as TextChannel;
            const message = await channel.messages.fetch(messageURL.split("/")[6]);

            const data = await database.reactionRoles.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                    UUID: interaction.customId.split(":")[1]
                }
            });

            if (
                (data?.Button?.Type || data?.SelectMenu?.Label) &&
                message.author.id != client.user?.id
            ) {
                return handleError(
                    null,
                    "The message is not created by me. Only reactions can be added to other messages."
                );
            }

            if (data?.Emoji) {
                return handleError(
                    null,
                    "I can't add a reaction to the message because there is another message I listen to. Create a new reaction role instead and use the Emoji."
                );
            }

            if (data?.Button?.Emoji) {
                try {
                    const existingComponents = message.components;

                    const newButton = new ButtonBuilder()
                        .setCustomId(`reactionroles-button:${data.UUID}`)
                        .setLabel(
                            data?.Button?.Label ? data?.Button?.Label : "‎"
                        )
                        .setStyle(
                            data?.Button?.Type
                                ? Number(data?.Button?.Type)
                                : ButtonStyle.Secondary
                        )
                        .setEmoji(data?.Button?.Emoji as string);

                    let updatedComponents = [...existingComponents];
                    let added = false;

                    for (const row of updatedComponents) {
                        if ((row as ActionRow<MessageActionRowComponent>).components.length < 5) {
                            (row as ActionRow<MessageActionRowComponent>).components.push(
                                newButton as unknown as MessageActionRowComponent
                            );
                            added = true;
                            break;
                        }
                    }

                    if (!added) {
                        updatedComponents.push(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                newButton
                            ) as unknown as ActionRow<MessageActionRowComponent>
                        );
                    }

                    await message.edit({
                        components: updatedComponents
                    });
                } catch (error) {
                    return handleError(
                        error,
                        `An error occurred while updating the message. Try to create a new reaction role instead.\-# A Button on the message has this custom ID.`
                    );
                }
            } else if (data?.SelectMenu?.Label) {
                try {
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

                    const newOption = {
                        label: data?.SelectMenu?.Label,
                        value: data.UUID,
                        emoji: data?.SelectMenu?.Emoji
                            ? data?.SelectMenu?.Emoji
                            : undefined,
                        description: data?.SelectMenu?.Description
                            ? data?.SelectMenu?.Description
                            : undefined
                    } as any;

                    if (currentSelectMenu) {
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

                    await message.edit({
                        components: existingComponents
                    });
                } catch (error) {
                    return handleError(
                        error,
                        `An error occurred while updating the message. Try to create a new reaction role instead.`
                    );
                }
            } else {
                return handleError(
                    null,
                    "There is no reaction role to add a reaction to. Create a new reaction role instead."
                );
            }
        } catch (error) {
            await handleError(
                error,
                "An unexpected error occurred. Please try again later."
            );
        }

        if (!client.user) throw new Error("Client user is not defined");
        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} The reaction role has been added to the message.`,
            flags: MessageFlags.Ephemeral
        });
    }
};
