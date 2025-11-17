import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType,
    Client, ContainerBuilder,
    GuildMemberRoleManager, LabelBuilder,
    MessageFlags, ModalBuilder,
    StringSelectMenuBuilder, StringSelectMenuInteraction, TextDisplayBuilder, TextInputBuilder, TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-user-settings",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const userData = await database.levels.findFirst({
            where: {
                GuildId: interaction.guild.id,
                UserId: interaction.values[0]
            }
        })

        const user = await interaction.guild.members.fetch(interaction.values[0])

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("user")} Manage <@${interaction.values[0]}>`,
                                    `${userData?.UUID ? `` : `### ${await convertToEmojiToPng("error")}  This Account does not exist!`}`,
                                    `-# **Level**: ${userData?.Level ?? "N/A"}`,
                                    `-# **XP**: ${userData?.XP ?? "N/A"}`,
                                    `-# **Last Streak Update**: ${userData?.LastXPStreakUpdate ? `<t:${Math.floor(new Date(userData.LastXPStreakUpdate).getTime() / 1000)}:R>` : `N/A`}`,
                                    `-# **Current Streak Day**: ${userData?.CurrentStreakDay ?? "N/A"}`,
                                    `-# **Current XP Drops**: ${userData?.ClaimedXPDrops ?? "N/A"}`,
                                    `-# **Required XP**: ${userData?.RequiredXp ?? "N/A"}`,
                                    `-# **UUID**: ${userData?.UUID ?? "N/A"}`
                                ].join("\n")
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("levels-user-settings-select:" + (userData?.UUID ?? "0"))
                                .setDisabled(
                                    user.user.bot || (!userData && !userData?.UUID)
                                )
                                .addOptions(
                                    [
                                        // Level
                                        {
                                            label: "Add Levels",
                                            description: "Add an amount of Levels",
                                            emoji: "<:add:1260157236043583519>",
                                            value: "level-add"
                                        },
                                        {
                                            label: "Set Level",
                                            description: "Set the Level Count",
                                            emoji: "<:renamesolid24:1259433901554929675>",
                                            value: "level-set"
                                        },
                                        {
                                            label: "Reset Levels",
                                            description: "Reset the Level Count",
                                            emoji: "<:reset:1260160749481889793>",
                                            value: "level-reset"
                                        },
                                        // XP
                                        {
                                            label: "Add XP",
                                            description: "Add an amount of Levels",
                                            emoji: "<:add:1260157236043583519>",
                                            value: "xp-add"
                                        },
                                        {
                                            label: "Set XP",
                                            description: "Set the Level Count",
                                            emoji: "<:renamesolid24:1259433901554929675>",
                                            value: "xp-set"
                                        },
                                        {
                                            label: "Reset XP",
                                            description: "Reset the XP Count",
                                            emoji: "<:reset:1260160749481889793>",
                                            value: "xp-reset"
                                        },
                                        // EXTRA
                                        {
                                            label: "Delete Data",
                                            description: `DANGER! Delete all level user data from ${user.displayName}`,
                                            emoji: "<:trash:1259432932234367069>",
                                            value: "delete"
                                        },
                                        {
                                            label: "Reset Level Data",
                                            description: "Delete all Level Data (XP, Level, ReqXP)",
                                            emoji: "<:reset:1260160749481889793>",
                                            value: "reset-level-data"
                                        },
                                    ]
                                )
                        )
                    )
            ]
        })


    },
};
