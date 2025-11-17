import {ContainerBuilder, MessageFlags, ModalSubmitInteraction, TextDisplayBuilder,} from "discord.js";
import ms from "ms";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "moderation-ban-set-duration-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuids = interaction.customId.split(":")[1];
        const reason = interaction.fields.getTextInputValue(
            "moderation-ban-set-duration-input"
        );
        let duration;
        try {
            duration = ms(Number(reason));
        } catch (error) {
            if (!client.user) throw new Error("Client not found");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Invalid duration`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.guildUserModeration.update({
            where: {
                UUID: uuids
            },
            data: {
                Duration: duration
            }
        });

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("check")} Duration has been set to:\n ${duration}`)
                    )
            ]
        });

    },
};
