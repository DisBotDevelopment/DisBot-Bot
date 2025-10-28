import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder, ChannelType, ContainerBuilder,
    MessageFlags, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "spotify-channel",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];

        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId("spotify-manage-channelname-channel:" + uuid)
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("Select your Channel/Thread")
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.PublicThread,
                    ChannelType.PrivateThread,
                    ChannelType.GuildAnnouncement
                )
        );

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng(
                                "add"
                            )} Update the Channel from the Notifications.`)
                    )
                    .addActionRowComponents(row)
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
        });
    }
};
