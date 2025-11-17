import {
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags, TextDisplayBuilder,
    TextDisplayComponent,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "twitch-remove",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.guildTwitchNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                UUID: interaction.customId.split(":")[1]
            }
        });
        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng(
                "error"
            )} The Channel has already been removed!`, interaction, true)
        }

        await database.guildTwitchNotifications.deleteMany({
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
                            .setContent(`## ${await convertToEmojiToPng("trash")} Successfully deleted Twitch Channel`)
                    )
            ],
            flags: MessageFlags.IsComponentsV2
        });
    }
};
