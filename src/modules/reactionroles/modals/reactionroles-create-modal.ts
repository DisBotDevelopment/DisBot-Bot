import {ActionRowBuilder, MessageFlags, ModalSubmitInteraction, RoleSelectMenuBuilder, TextChannel} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached");

        const messageURL = interaction.fields.getTextInputValue(
            "reactionroles-create-messageurl"
        );

        if (!messageURL) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Please provide a message URL and emojis`,
                flags: "Ephemeral",
            });
        }

        const messageURLValue = messageURL;

        if (!messageURLValue) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Please provide a message URL and emojis`,
                flags: "Ephemeral",
            });
        }

        const channel = await client.channels.fetch(messageURLValue.split("/")[5]);
        const message = await (channel as TextChannel).messages.fetch(
            messageURLValue.split("/")[6]
        );

        if (!channel) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Please provide a valid message URL`,
                flags: "Ephemeral",
            });
        }
        const uuids = randomUUID();

        const addmessageTemplate = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.fields.getTextInputValue(
                    "reactionroles-create-addmessage"
                )
            }
        });

        const removemessageTemplate = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.fields.getTextInputValue(
                    "reactionroles-create-removemessage"
                )
            }
        });

        if (
            interaction.fields.getTextInputValue("reactionroles-create-removemessage")
        ) {
            if (!removemessageTemplate) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Please provide a valid message ID`,
                    flags: "Ephemeral",
                });
            }
        }
        if (
            interaction.fields.getTextInputValue("reactionroles-create-addmessage")
        ) {
            if (!addmessageTemplate) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Please provide a valid message ID`,
                    flags: "Ephemeral",
                });
            }
        }

        await database.reactionRoles.create({
            data: {
                UUID: uuids,
                Guilds: {
                    connect: {
                        GuildId: interaction.guild?.id
                    }
                },
                ChannelId: channel.id,
                AddMessage: interaction.fields.getTextInputValue(
                    "reactionroles-create-addmessage"
                )
                    ? interaction.fields.getTextInputValue(
                        "reactionroles-create-addmessage"
                    )
                    : null,
                RemoveMessage: interaction.fields.getTextInputValue(
                    "reactionroles-create-removemessage"
                )
                    ? interaction.fields.getTextInputValue(
                        "reactionroles-create-removemessage"
                    )
                    : null,
                MessageId: message.id,
                Roles: [],
            }
        });

        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("reactionroles-select-roles:" + uuids)
                .setPlaceholder("Select your Roles")
                .setMaxValues(25)
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("role", client.user?.id)} Select your Roles by reacting to the message`,
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
