import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder,
    MessageFlags,
    RoleSelectMenuBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-manage-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral,
            })
            const uuid = value
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
                            new TextDisplayBuilder().setContent(
                                [
                                    `# ${await convertToEmojiToPng("ticket")} Component ${data.TicketChannelName}`,
                                    `> **Component Id**: ${data.CustomId}`,
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
                                    .setLabel("Message Template")
                            )
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("Select Blacklist Roles, Transcript Channel and Permissions")
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId("ticket-add-component-blacklist:" + uuid)
                                    .setMaxValues(25)
                                    .setMinValues(0)
                                    .setPlaceholder("Select Blacklist Roles")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId("ticket-add-component-transcript:" + uuid)
                                    .setPlaceholder("Select a Transcript Channel")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-permission:" + uuid)
                                    .setEmoji("<:permissions:1277170947761111130>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Ticket Permissions")
                            )
                        )
                        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("Select custom and optional options")
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId("ticket-add-component-required-roles:" + uuid)
                                    .setMaxValues(25)
                                    .setMinValues(0)
                                    .setPlaceholder("Select Required Roles to open a ticket")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-modal:" + uuid)
                                    .setEmoji("<:package:1365715766623604746>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Modal Component"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-ticket-limit:" + uuid)
                                    .setEmoji("<:renamesolid24:1259433901554929675>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Ticket Limit"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-ticket-rate:" + uuid)
                                    .setEmoji("<:limit:1412020233023131760>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Rate Limit")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-only-claim:" + uuid)
                                    .setEmoji("<:support:1259853380885549117>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Only Claim Mode"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-feedback:" + uuid)
                                    .setEmoji("<:feedback:1400662627268427777>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Feedback from User")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-automation:" + uuid)
                                    .setEmoji("<:workflow:1400780067877163189>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Automatic Actions"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-send-transcript:" + uuid)
                                    .setEmoji("<:file:1381000301124911134>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Send Transcript to User")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-command:" + uuid)
                                    .setEmoji("<:terminal:1260322426323996783>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Setup Ticket Command"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-open-time:" + uuid)
                                    .setEmoji("<:timer:1321939051921801308>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Add Open Time Requirement")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-ticket-creation-cooldown:" + uuid)
                                    .setEmoji("<:timer:1321939051921801308>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Add Creation Cooldown"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-add-dm-message:" + uuid)
                                    .setEmoji("<:message:1322252985702551767>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Add User DM when Close")
                            )
                        )
                        .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-use:" + uuid)
                                    .setEmoji("<:puzzle:1381000302601441440>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Use Component"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-add-component-show:" + uuid)
                                    .setEmoji("<:emoji:1288230393757171825>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Show Component"),
                                new ButtonBuilder()
                                    .setCustomId("ticket-manage-component-delete:" + uuid)
                                    .setEmoji("<:emoji:1259432932234367069>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("Delete Component")
                            )
                        )
                ]
            });
        }
    }
}
;
