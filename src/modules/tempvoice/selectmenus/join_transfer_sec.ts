import {ButtonStyle, Client, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "join_transfer_sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        interaction.values.forEach(async (value) => {
            if (!interaction.guild) return;
            if (!interaction.member) return;
            if (value == interaction?.member?.user?.id)
                return interaction.deferUpdate();

            const member = interaction.guild.members.cache.get(interaction.user.id);

            const channel = interaction.guild.channels.cache.get(
                member?.voice.channelId as string
            );
            if (value == interaction.user.id)
                return interaction.editReply({
                    content: `## ${await convertToEmojiPng(
                        "error",
                        client.user.id
                    )} You can't transfer the channel to yourself`
                });

            await database.tempVoiceChannels.update(
                {
                    where: {
                        GuildId: interaction.guild.id,
                        ChannelId: channel?.id
                    },
                    data: {
                        OwnerId: value
                    }
                },
            );

            interaction.editReply({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} You have successfully transferred the channel to <@${value}>`
            });
        });
    }
};
