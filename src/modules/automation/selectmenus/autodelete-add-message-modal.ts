import "dotenv/config";
import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-add-message-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        const uuid = interaction.customId.split(":")[1];

        if (!client.user) throw new Error("Client user is not cached.");

        // Neue Nachrichten aus dem Input holen
        const newMessages = interaction.fields.getTextInputValue("autodelete-add-message-input")
            .split(",")
            .map(msg => msg.trim())
            .filter(msg => msg.length > 0); // Leere Strings filtern

        await database.autoDeletes.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    WhitelistedMessages: {
                        push: [...newMessages]
                    }
                }
            },
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} Whitelisted messages added successfully! (${newMessages.length} new messages)`,
            flags: MessageFlags.Ephemeral,
        })
    },
};