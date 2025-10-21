import { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import ms, { StringValue } from "ms";
import { ExtendedClient } from "../../../../types/client.js";
import { convertToEmojiToPng } from "../../../../helper/emojis.js";
import { PermissionType } from "../../../../enums/permissionType.js";

export default {
    subCommand: "utility.slowmode",
    options: {
        once: false,
        cooldown: 3000,
        botPermissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages],
        userPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        const channel = interaction.channel as TextChannel | null;
        const stringTime = interaction.options.getString("time", true);

        if (!client.user) throw new Error("No user was found.");

        if (!channel || channel.type !== 0) { // 0 = GuildText
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Please run this in a text channel.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const timeInMS = ms(stringTime as StringValue);
        if (!timeInMS || isNaN(timeInMS)) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Invalid time format.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const timeInSeconds = Math.floor(timeInMS / 1000);

        if (timeInSeconds > 21600) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} The slowmode time is too long. Use a time under 6 hours.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await channel.setRateLimitPerUser(timeInSeconds, "User ran the /discord slowmode command");

        return interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Slowmode set to ${timeInSeconds} seconds.`,
            flags: MessageFlags.Ephemeral
        });
    }
};
