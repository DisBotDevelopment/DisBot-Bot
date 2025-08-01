import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags, PermissionFlagsBits, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    id: "logging-show-note",
    options: {
        once: false,
        permission: PermissionType.Logging,
        cooldown: 3000,
        botPermissions: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageGuild,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory
        ],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1]

        const data = await database.guildLoggers.findFirst({
            where: {
                UUID: uuid
            }
        })

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        Array.isArray(data.Notes) && data.Notes.length > 0
                            ? data.Notes.map((s, i) => `${i + 1}. ${s}`).join('\n')
                            : "No Notes found: N/A"
                    )
                )
            ]
        })


    }
};
