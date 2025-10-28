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
    id: "youtube-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.guildYoutubeNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!client.user) throw new Error("Client User is not defined");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng(
                "error"
            )} The Channel has already been removed!`, interaction, true)
        }
        await database.guildYoutubeNotifications.deleteMany({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });

        await interaction.update({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("trash")} Successfully deleted Youtube Channel`)
                    )
            ],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
