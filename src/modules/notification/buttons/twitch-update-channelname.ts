import {
    ActionRowBuilder,
    ButtonInteraction,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    MessageFlags, TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "twitch-update-channelname",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
            new ChannelSelectMenuBuilder()
                .setCustomId("twitch-edit-channel:" + uuid)
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

        if (!client.user) throw new Error("Client User is not defined");

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
