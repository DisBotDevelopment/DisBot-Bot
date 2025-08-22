import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelSelectMenuInteraction,
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
    id: "permissions-manage-channels",

    /**
     * @param {ChannelSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: ChannelSelectMenuInteraction, client: ExtendedClient) {
        const guildId = interaction.guild?.id;

        const data = await database.guildInteractionPermissions.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })


        if (!data) return interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiPng("error", client.user.id)} No Data!`
        })

        await database.guildInteractionPermissions.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                ChannelIds: {
                    set: interaction.values
                }
            }
        })
        await interaction.deferUpdate()
    }
};
