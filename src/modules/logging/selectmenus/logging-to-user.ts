import {
    AttachmentBuilder,
    ContainerBuilder, FileBuilder,
    MessageFlags, PermissionFlagsBits, TextDisplayBuilder,

    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {cli} from "winston/lib/winston/config/index.js";
import {PermissionType} from "../../../enums/permissionType.js";

export default {
    id: "logging-to-user",
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
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1]

        const data = await database.guildLoggers.findFirst({
            where: {
                UUID: uuid,
                GuildId: interaction.guild.id
            }
        })

        for (const value of interaction.values) {
            const index = interaction.values.indexOf(value);

            const user = await client.users.fetch(value)
            const dmChannel = await user.createDM(true)

            if (!dmChannel) return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} I can't send a DM to this user!`,
                flags: MessageFlags.Ephemeral,
            })

            await user.send({
                flags: MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(data.LogMessage)
                    ).addFileComponents(
                        new FileBuilder().setURL("attachment://Log-Export.json")
                    )
                ],
                files: [
                    new AttachmentBuilder(Buffer.from(data.LogJSON, "utf8")).setName("Log-Export.json")
                ]
            })

            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Message sent to this user!`,
                flags: MessageFlags.Ephemeral,
            })

        }
    }
};
