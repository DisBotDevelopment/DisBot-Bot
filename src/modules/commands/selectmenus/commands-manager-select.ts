import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    Client,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits,
    PermissionsBitField,
    RoleSelectMenuBuilder,
    TextDisplayBuilder,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {GuildPermissionType} from "../../../enums/permissionType.js";
import {randomUUID} from "crypto";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "commands-manager-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: ExtendedClient) {
        for (const commandName of interaction.values) {
            const guildId = interaction.guild?.id;

            let data = await database.buildInCommands.findFirst({
                where: {
                    GuildCommandMangerId: interaction.guild.id,
                    CodeName: commandName
                }
            })

            if (!data) {
                await database.buildInCommands.create({
                    data: {
                        UUID: randomUUID(),
                        CustomName: commandName,
                        CodeName: commandName,
                        Description: client.commands.get(commandName).data.description,
                        Permissions: client.commands.get(commandName).data.default_member_permissions as string,
                        GuildCommandMangers: {
                            connect: {
                                GuildId: interaction.guildId
                            }
                        }
                    }
                })
                data = await database.buildInCommands.findFirst({
                    where: {
                        CodeName: commandName,
                        GuildCommandMangerId: interaction.guildId
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
                                    [`## ${await convertToEmojiPng("terminal", client.user.id)} ${data.CustomName} (Build-in Command)`,
                                        ``,
                                        `**Custom Name:** ${data.CustomName}`,
                                        `**Description:** ${client.commands.get(data.CodeName).data.description ?? "N/A"}`,
                                        `**Code Name**: ${data.CodeName}`,
                                        `**UUID**: ${data.UUID}`,
                                    ].join("\n"))
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("commands-manager-name:" + data.UUID)
                                    .setEmoji("<:renamesolid24:1259433901554929675>")
                                    .setLabel("Rename Command")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("commands-manager-description:" + data.UUID)
                                    .setEmoji("<:<:description:1321938426576109768>")
                                    .setLabel("Edit Description")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("commands-manager-permission:" + data.UUID)
                                    .setEmoji("<:permissions:1277170947761111130>")
                                    .setLabel("Set Permissions")
                                    .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                    .setCustomId("commands-manager-toggle:" + data.UUID)
                                    .setEmoji("<:toggleon:1301864515838672908>")
                                    .setLabel("Toggle the Command")
                                    .setStyle(ButtonStyle.Secondary)
                            )
                        )
                ]
            })


        }
    }
};
