import {
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "spotify-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client User is not defined");

        const uuid = interaction.customId.split(":")[1];

        const data = await database.guildSpotifyNotifications.findFirst({
            where: {
                UUID: uuid
            }
        });
        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng(
                "error"
            )} The Channel has already been removed!`, interaction, true)
        }

        await database.guildSpotifyNotifications.delete({
            where: {
                UUID: uuid
            }
        });

        await interaction.update({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("trash")} Successfully deleted Spotify Show`)
                    )
            ],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
