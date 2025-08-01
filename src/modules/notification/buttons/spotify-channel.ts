import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    MessageFlags,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
  id: "spotify-channel",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];

        interaction.reply({
            components: [
                new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId(`spotify-manage-channelname-channel:${uuid}`)
                        .setPlaceholder("Select a Channel")
                        .setMinValues(1)
                        .setMaxValues(1)
                )
            ],
            flags: MessageFlags.Ephemeral,
        })
    }
};
