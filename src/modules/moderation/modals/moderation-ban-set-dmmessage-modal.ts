import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "moderation-ban-set-dmmessage-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuids = interaction.customId.split(":")[1];
        const reason = interaction.fields.getTextInputValue(
            "moderation-ban-set-dmmessage-input"
        );

        await database.guildUserModeration.update({
            where: {
                UUID: uuids
            },
            data: {
                DmMessage: reason
            }
        });

        if (!client.user) throw new Error("Client not found");
        interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} DM Message has been set to \n\`${reason}\``,
            flags: MessageFlags.Ephemeral,
        });
    },
};
