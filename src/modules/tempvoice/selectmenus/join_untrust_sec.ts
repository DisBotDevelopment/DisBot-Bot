import { Client, MessageFlags, UserSelectMenuInteraction, VoiceChannel } from "discord.js";
import { convertToEmojiPng } from "../../../helper/emojis.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
    id: "join_untrust_sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        interaction.values.forEach(async (value) => {
            if (value == interaction.member?.user.id)
                return interaction.deferUpdate();

            if (!interaction.guild) throw new Error("No Guild found.");
            const member = interaction.guild.members.cache.get(interaction.user.id);

            const channel = interaction.guild.channels.cache.get(
                member?.voice.channelId as string
            );

            if (value == interaction.user.id)
                return interaction.editReply({
                    content: `${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} You can't untrust yourself`
                });

            (channel as VoiceChannel).permissionOverwrites.delete(value);
            const members = interaction.guild.members.cache.get(value);

            members?.voice.setChannel(null);

            const untrust = interaction.guild.members.cache.get(value);

            interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} You have successfully untrust the channel to <@${value}>`
            });
        });
    }
};
