import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Client, ContainerBuilder,
    GuildMemberRoleManager,
    LabelBuilder,
    MessageFlags,
    ModalBuilder,
    RoleSelectMenuInteraction, StringSelectMenuBuilder,
    StringSelectMenuInteraction, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "levels-settings-roles-add",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: RoleSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const role = interaction.values[0]

        let data = await database.levelRoles.findFirst({
            where: {
                RoleId: role
            }
        })

        if (!data) {
            await database.levelRoles.create({
                data: {
                    LevelSettings: {
                        connect: {
                            GuildId: interaction.guild.id
                        }
                    },
                    RoleId: role
                }
            })
            data = await database.levelRoles.findFirst({
                where: {
                    RoleId: role
                }
            })
        }

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`Selected Role: <@&${role}> - Please use the Buttons to setup the Level Role. (More follow.)`)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("levels-settings-roles-add-levels:" + role)
                                .setLabel("Level Options")
                                .setEmoji("<:wandsparkles:1433176825764249651>")
                                .setStyle(ButtonStyle.Secondary),
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("levels-settings-roles-add-types:" + role)
                                .setPlaceholder("Currently you can select one type")
                                .setMaxValues(1)
                                .setMinValues(1)
                                .addOptions(
                                    [
                                        {
                                            label: "LevelUp",
                                            description: "Remove by LevelUp",
                                            emoji: "<:upvote:1259853379363016744>",
                                            value: "level"
                                        },
                                        {
                                            label: "Next Role",
                                            description: "Remove role by next Role",
                                            emoji: "<:role:1335667919119585480>",
                                            value: "role"
                                        },
                                        {
                                            label: "Not Remove",
                                            description: "Not Remove role.",
                                            emoji: "<:role:1335667919119585480>",
                                            value: "not"
                                        }
                                    ]
                                )
                        )
                    )
            ]
        })

    },
};
