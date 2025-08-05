import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder, ChannelType,
    ContainerBuilder,
    MessageFlags, RoleSelectMenuBuilder, SeparatorBuilder, SeparatorComponent, SeparatorSpacingSize,
    StringSelectMenuBuilder,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-command",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        })

        const uuid = interaction.customId.split(":")[1]

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        })

        await interaction.editReply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent
                        (
                            [
                                `# ${await convertToEmojiPng("terminal", client.user.id)} Ticket Command`,
                                ``
                            ].join("\n")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-command-slash:" + uuid)
                                .setEmoji("<:message:1145266858057019524>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Add Slash Command"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-command-text:" + uuid)
                                .setEmoji("<:timer:1290285652423868417>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Add Text Command"),
                        )
                    )
            ]
        })


    }
};
