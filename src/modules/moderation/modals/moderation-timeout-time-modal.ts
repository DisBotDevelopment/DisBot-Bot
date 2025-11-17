import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import ms, {StringValue} from "ms";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "moderation-timeout-time-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuids = interaction.customId.split(":")[1];
        const reason = interaction.fields.getTextInputValue(
            "moderation-timeout-time-input"
        );
        let duration;
        try {
            duration = ms(reason as StringValue);

            const maxDuration = 28 * 24 * 60 * 60 * 1000;


            if (Number(duration) > Number(maxDuration)) {
                if (!client.user) throw new Error("Client not found");

                return interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")} The maximum duration is 28 days`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        } catch (error) {
            if (!client.user) throw new Error("Client not found");

            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Invalid duration`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const cache = (client.cache.get(uuids) as { time?: string }) || {};

        cache.time = String(duration);

        if (!client.user) throw new Error("Client not found");
        interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Duration has been set to \`${duration}\`ms`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
