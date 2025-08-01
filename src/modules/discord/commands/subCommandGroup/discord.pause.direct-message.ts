import {ChannelType, ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";

export default {
    subCommandGroup: "discord.pause.direct-message",

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        if (!client.user) throw new Error("User is not logged in.");

        await interaction.deferReply(
            {
                flags: MessageFlags.Ephemeral
            }
        )


        if (interaction.guild?.incidentsData?.dmsDisabledUntil != null) {
            await interaction.guild?.setIncidentActions(
                {
                    dmsDisabledUntil: null
                }
            )
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} You set DM to be disabled until ${interaction.guild?.incidentsData?.dmsDisabledUntil}`
            })
        } else {
            await interaction.guild?.setIncidentActions({dmsDisabledUntil: Date.now() + 24 * 60 * 60 * 1000});
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} You set DM to be enabled until ${interaction.guild?.incidentsData?.dmsDisabledUntil}`
            })
        }
    }
};
