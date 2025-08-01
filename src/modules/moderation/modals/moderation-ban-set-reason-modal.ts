import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "moderation-ban-set-reason-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuids = interaction.customId.split(":")[1];
        const reason = interaction.fields.getTextInputValue(
            "moderation-ban-set-reason-input"
        );

        await database.guildBans.update(
            {
                where: {UUID: uuids}, data: {Reason: reason}
            }
        );

        if (!client.user) throw new Error("Client not found");
        interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Reason has been set`,
            flags: MessageFlags.Ephemeral,
        });
    },
};
