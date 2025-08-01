import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
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
    id: "ticket-add-component",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        })

        const uuid = randomUUID()


        await database.ticketSetups.create({
            data: {
                CustomId: uuid,
                Guilds: {
                    connect: {
                        GuildId: interaction.guild.id
                    }
                }
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
                                `# ${await convertToEmojiPng("puzzle", client.user.id)} Component Editor`,
                                `- Use the Buttons and Menus to Setup your Ticket Component`,
                                `- If you need help with this you can read more here: https://docs.disbot.app/docs/features/ticket`,
                                ``
                            ].join("\n")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-channel-name:" + uuid)
                                .setEmoji("<:renamesolid24:1259433901554929675>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Ticket Channel Name"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-channel-type:" + uuid)
                                .setEmoji("<:threads:1298014776965857372>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Change Channel Type"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-message:" + uuid)
                                .setEmoji("<:message:1322252985702551767>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Message Template"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-modal:" + uuid)
                                .setEmoji("<:package:1365715766623604746>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Modal Component"),
                        )
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("Select Moderator Roles, Transcript Channel and Blacklist Roles")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("ticket-add-component-blacklist:" + uuid)
                                .setPlaceholder("Select Blacklist Role")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("ticket-add-component-handlers:" + uuid)
                                .setPlaceholder("Select Moderation Role")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("ticket-add-component-transcript:" + uuid)
                                .setPlaceholder("Select a Transcript Channel")
                        )
                    )
                    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("Select custom and optional options")
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("ticket-add-component-shadow-ping:" + uuid)
                                .setPlaceholder("Select Moderator Roles to shadow ping it.")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId("ticket-add-component-required-roles:" + uuid)
                                .setPlaceholder("Select Required Roles to open a ticket")
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-ticket-limit:" + uuid)
                                .setEmoji("<:renamesolid24:1259433901554929675>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Ticket Limit"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-feedback:" + uuid)
                                .setEmoji("<:feedback:1400662627268427777>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Feedback from User"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-permission:" + uuid)
                                .setEmoji("<:permissions:1277170947761111130>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Custom User Permission"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-user-close:" + uuid)
                                .setEmoji("<:userdetail:1321937833296134205>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Edit Close Actions"),
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-send-transcript:" + uuid)
                                .setEmoji("<:file:1381000301124911134>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Send Transcript to User"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-command:" + uuid)
                                .setEmoji("<:terminal:1260322426323996783>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Setup Ticket Command"),
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
                                .setCustomId("ticket-add-component-assign-handler:" + uuid)
                                .setEmoji("<:authorize:1377367876788551792>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Auto assign Moderator from Moderator Roles"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-ticket-creation-cooldown:" + uuid)
                                .setEmoji("<:timer:1321939051921801308>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Add creation Cooldown Per User"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-add-dm-message:" + uuid)
                                .setEmoji("<:message:1322252985702551767>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Add User DM when Close"),
                        )
                    )
                    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-save:" + uuid)
                                .setEmoji("<:check:1320090167444377713>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Validate & Save Component"),
                            new ButtonBuilder()
                                .setCustomId("ticket-add-component-use:" + uuid)
                                .setEmoji("<:puzzle:1381000302601441440>")
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Use Component")
                        )
                    )
            ]
        })


    }
};
