import {
    ActionRowBuilder,
    ButtonStyle,
    Client,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "spotify-add-channelname-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];
        interaction.values.forEach(async (role) => {


            await database.spotifyNotifications.update(
                {
                    where: {
                        UUID: uuid
                    }
                    ,
                    data: {
                        ChannelId: role,
                    }
                }
            );

            const modal = new ModalBuilder()
                .setCustomId("spotify-add-channelname-message-modal:" + uuid)
                .setTitle("Add a Message Template")
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId("messageTemplate")
                                .setLabel("Message Template ID")
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder("Enter the Message Template ID")
                                .setRequired(true)
                        )
                );

            await interaction.showModal(modal);


        })
    }
};
