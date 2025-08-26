import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder,
    Client, ContainerBuilder,
    EmbedBuilder,
    MessageFlags, RoleSelectMenuBuilder, TextDisplayBuilder, UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {GuildPermissionType} from "../../../enums/permissionType.js";
import {randomUUID} from "crypto";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "permissions-subcommands-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: ExtendedClient) {
        for (const commandName of interaction.values) {
            const guildId = interaction.guild?.id;

            let data = await database.guildInteractionPermissions.findFirst({
                where: {
                    CommandName: commandName,
                    GuildId: interaction.guild.id,
                    Type: GuildPermissionType.SUBCOMMAND
                }
            })

            if (!data) {
                await database.guildInteractionPermissions.create({
                    data: {
                        UUID: randomUUID(),
                        Type: GuildPermissionType.SUBCOMMAND,
                        CommandName: commandName,
                        Guilds: {
                            connect: {
                                GuildId: guildId
                            }
                        },
                    }
                })
                data = await database.guildInteractionPermissions.findFirst({
                    where: {
                        GuildId: interaction.guild.id,
                        CommandName: commandName,
                        Type: GuildPermissionType.SUBCOMMAND
                    }
                })
            }

            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(
                                    [`## ${await convertToEmojiPng("terminal", client.user.id)} ${data.CommandName.split(".").join(" ")} (${data.UUID})`,
                                        ``,
                                        `**Interaction Name:** ${client.subCommands.get(data.CommandName).interactionName ?? "N/A"}`,
                                        `**Description:** ${client.subCommands.get(data.CommandName).interactionDescription ?? "N/A"}`,
                                        `**Command Name**: ${data.CommandName.split(".").join(" ")}`,
                                        `**Type**: ${data.Type}`,
                                        `**UUID**: ${data.UUID}`,
                                    ].join("\n"))
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setLabel("Set Cooldown")
                                    .setEmoji("<:timer:1321939051921801308>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("permissions-manage-cooldown:" + data.UUID),
                                new ButtonBuilder()
                                    .setLabel("Require Guild Owner")
                                    .setEmoji("<:Owner:1191425492256047154>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("permissions-manage-owner:" + data.UUID),
                                new ButtonBuilder()
                                    .setLabel("Disable Internal User Permission")
                                    .setEmoji("<:permissions:1277170947761111130>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("permissions-manage-user-permission:" + data.UUID),
                                new ButtonBuilder()
                                    .setLabel("Reset Interaction Permissions")
                                    .setEmoji("<:reset:1260160749481889793>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setCustomId("permissions-manage-reset:" + data.UUID)
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                                new UserSelectMenuBuilder()
                                    .setCustomId("permissions-manage-users:" + data.UUID)
                                    .setMinValues(0)
                                    .setMaxValues(25)
                                    .setDefaultUsers(data.UserIds)
                                    .setPlaceholder("Select users you want to allow to use this interaction!")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                                new ChannelSelectMenuBuilder()
                                    .setCustomId("permissions-manage-channels:" + data.UUID)
                                    .setMinValues(0)
                                    .setMaxValues(25)
                                    .setDefaultChannels(data.ChannelIds)
                                    .setPlaceholder("Select channels you want to allow to use this interaction!")
                            )
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId("permissions-manage-roles:" + data.UUID)
                                    .setMinValues(0)
                                    .setMaxValues(25)
                                    .setDefaultRoles(data.RoleIds)
                                    .setPlaceholder("Select roles you want to allow to use this interaction!")
                            )
                        )
                ]
            })
        }
    }
};
