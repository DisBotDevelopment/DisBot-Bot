import {
    ActionRowBuilder,
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle, ContainerBuilder, GuildTextBasedChannel,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits, StringSelectMenuBuilder, TextBasedChannel, TextChannel, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {DisBotInteractionType} from "../../../enums/disBotInteractionType.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "channel-link-linkedwith",
    type: DisBotInteractionType.SelectMenu,
    options: {
        once: false,
        cooldown: 3000, // 3 seconds
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false
    },

    /**
     * @param {AnySelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: AnySelectMenuInteraction, client: ExtendedClient
    ) {

        await database.guildChannelLinks.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                LinkedWith: {
                    set: interaction.values
                }
            }
        })

        await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiToPng("check")} Updated your Channel-Link Linked Channel! (${interaction.values.length})`
            }
        )

    }
}

