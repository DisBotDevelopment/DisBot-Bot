import {
    ButtonInteraction, ContainerBuilder, TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "channel-link-delete",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");

        await database.guildChannelLinks.delete({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        })

        await interaction.update({
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${await convertToEmojiToPng("check")} Successfully deleted your Channel Link`))
                ]
            }
        )

    }
};
