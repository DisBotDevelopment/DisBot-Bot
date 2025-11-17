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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ticketCloseAction} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-add-component-automation",

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
                                `# ${await convertToEmojiToPng("workflow")} Ticket Automation`,
                                ``
                            ].join("\n")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("ticket-add-component-auto-old-category:" + uuid)
                                .setPlaceholder("Select Old Ticket Category")
                                .setDisabled(data.ChannelType == ChannelType.PrivateThread)
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("ticket-add-component-auto-claim:" + uuid)
                                .setPlaceholder("Select Role to random assign a Member to the Ticket")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("ticket-add-component-auto-close-action:" + uuid)
                                .setPlaceholder("Select your Auto Close Actions")
                                .setMaxValues(4)
                                .setMinValues(1)
                                .addOptions(
                                    ticketCloseAction
                                )
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-auto-reply:" + uuid)
                                .setEmoji("<:message:1322252985702551767>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Enable Auto Reply Message"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-auto-close:" + uuid)
                                .setEmoji("<:timer:1321939051921801308>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Set auto close after time"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-auto-inactivity:" + uuid)
                                .setEmoji("<:timer:1321939051921801308>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Set auto close after Inactivity"),
                        )
                    )
            ]
        })


    }
};
