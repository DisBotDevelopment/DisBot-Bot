import {
    ActionRowBuilder, AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ContainerBuilder,
    EmbedBuilder, FileBuilder,
    MessageFlags,
    ModalBuilder, PermissionFlagsBits, TextDisplayBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {PermissionType} from "../../../enums/permissionType.js";
import {database} from "../../../main/database.js";

export default {
    id: "logging-actions",
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
        const eventName = interaction.customId.split(":")[2]

        const data = await database.guildLogs.findFirst({
            where: {
                UUID: uuid
            }
        })
        
        const fileBuffer = Buffer.from(JSON.parse(data.LogJSON), "utf-8");
        
        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("logging-add-note:" + uuid)
                                .setLabel("Add Note")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("logging-delete-note:" + uuid)
                                .setLabel("Delete Note by Id")
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId("logging-show-note:" + uuid)
                                .setLabel("Show all notes")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    )
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# **Send this Log to a User (DM)**"))
                    .addActionRowComponents(
                        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId("logging-to-user:" + uuid)
                        )
                    )
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# **Send this log to a Channel (In this Guild)**"))
                    .addActionRowComponents(
                        new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                            new ChannelSelectMenuBuilder()
                                .setCustomId("logging-to-channel:" + uuid)
                                .setChannelTypes(ChannelType.GuildText, ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread, ChannelType.GuildAnnouncement)
                        )
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://${eventName}.json`)
                    )
            ],
            files: [
                new AttachmentBuilder(fileBuffer).setName(`${eventName}.json`),
            ],
        })
    }
};
