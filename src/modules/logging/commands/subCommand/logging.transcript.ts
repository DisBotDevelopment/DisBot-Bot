import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiGif} from "../../../../helper/emojis.js";
import {createTranscript, ExportReturnType} from "discord-html-transcripts";
import {
    ChatInputCommandInteraction,
    ContainerBuilder,
    FileBuilder,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import pkg from "short-uuid";
import {PermissionType} from "../../../../enums/permissionType.js";

const {uuid} = pkg;

export default {
    subCommand: "logging.transcript", options: {
        once: false,
        permission: PermissionType.Logging,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
        userPermissions: [PermissionFlagsBits.ManageGuild],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    execute: async function (
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const channel = interaction.options.getChannel("channel") ?? interaction.channel;


        const attachments = await createTranscript(channel as any, {
            limit: -1,
            filename: `transscript-${interaction.guild.id}-${channel?.id}.html`,
            saveImages: true,
            poweredBy: false,
            returnType: ExportReturnType.Attachment
        });

        const logFile = Buffer.from(
            attachments.attachment.toString(),
            "utf-8"
        );


        await interaction.editReply({

            components: [
                new ContainerBuilder().addFileComponents(
                    new FileBuilder().setURL(`attachment://transcript-${interaction.guild.id}-${channel?.id}.html`)
                )
            ],
            files: [
                {
                    attachment: logFile,
                    name: `transcript-${interaction.guild.id}-${channel?.id}.html`
                }
            ]
        });
    }
};
