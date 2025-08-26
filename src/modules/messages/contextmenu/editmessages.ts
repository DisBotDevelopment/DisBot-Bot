import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits, TextDisplayBuilder, TextDisplayComponent
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    options: {
        once: false,
        permission: PermissionType.Other,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
        userPermissions: [PermissionFlagsBits.ManageMessages],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    type: DisBotInteractionType.ContextMenu,
    context: true,
    data: new ContextMenuCommandBuilder()
        .setName("Edit this message")
        .setNameLocalizations({
            de: "Bearbeite diese Nachricht",
        })

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false)
        .setType(ApplicationCommandType.Message),

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ContextMenuCommandInteraction, client: ExtendedClient) {
        if (!interaction.guild) return;
        if (!interaction.inGuild()) return;

        const message = interaction.targetId;

        const messageToEdit = await interaction.channel?.messages.fetch(message);

        if (!messageToEdit) {
            return interaction.reply({
                content: "## I can't find that message!",
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!client.user) throw new Error("Client user is not cached.");

        if (messageToEdit.author.id != client.user.id && messageToEdit.webhookId == null) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("errors", client.user.id)} You can only edit messages sent by me or a webhook.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`## ${await convertToEmojiPng("edit", client.user.id)} Edit the message content or embed.\n-# **In the Future you can edit it in the DisBot Editor**`)
            )
            .addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId("editmessages-message-message:" + messageToEdit.id)
                        .setLabel("Edit Message")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("<:edit:1259961121075626066>")
                )
            )

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents()
        if (messageToEdit.embeds.length >= 1) {

            messageToEdit.embeds
                .filter((_, i) => i <= 4)
                .forEach((embed, index) => {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`editmessages-embed:${messageToEdit.id}:${index}`)
                            .setLabel(`Edit Embed with Id ${index + 1}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:edit:1259961121075626066>")
                    )
                })

            container.addActionRowComponents(row)
        }

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents()
        if (messageToEdit.embeds.length >= 6) {

            messageToEdit.embeds
                .filter((_, i) => i >= 5)
                .forEach((embed, index) => {
                    const realIndex = index + 5
                    row2.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`editmessages-embed:${messageToEdit.id}:${realIndex}`)
                            .setLabel(`Edit Embed with Id ${realIndex + 1}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:edit:1259961121075626066>")
                    )
                })

            container.addActionRowComponents(row2)
        }

        await interaction.reply({
            components: [container],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    },
};
