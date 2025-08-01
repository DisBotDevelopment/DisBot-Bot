import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import ms from "ms";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
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
                content: `## ${await convertToEmojiPng("error", client.user.id)} Invalid duration`,
                flags: MessageFlags.Ephemeral,
            });
        }

        await database.guildBans.update({
            where: {
                UUID: uuids
            },
            data: {
                Time: duration
            }
        });

        if (!client.user) throw new Error("Client not found");
        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Duration has been set to \`${duration}\`ms`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
