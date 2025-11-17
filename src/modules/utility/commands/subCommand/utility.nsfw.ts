import { ButtonStyle, ChannelType, ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import { ExtendedClient } from "../../../../types/ExtendedClient.js";
import { convertToEmojiToPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
    subCommand: "utility.nsfw",
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {

        const channel = interaction.channel as TextChannel;

        if (!client.user) throw new Error("No user was found.");
        if (!channel) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Please run this in as a text channel`,
                flags: MessageFlags.Ephemeral
            });
        }
        if (!channel.nsfw) {
            await channel.setNSFW(true, "User runed the command /discord nsfw")
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("check")} This channel is now set to NSFW`,
                flags: MessageFlags.Ephemeral
            })
        } else {
            await channel.setNSFW(false, "User runed the command /discord nsfw")
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("check")} This channel is now set to not NSFW`,
                flags: MessageFlags.Ephemeral
            })
        }
    }
};
