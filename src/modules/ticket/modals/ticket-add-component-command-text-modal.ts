import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import ms, {StringValue} from "ms";

export default {
    id: "ticket-add-component-command-text-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const text = interaction.fields.getTextInputValue(
            "text"
        );

        const menuID = interaction.customId.split(":")[1];

        await database.ticketSetups.update(
            {
                where: {
                    CustomId: menuID
                },
                data: {
                    TextCommandName: text ? text : null
                }
            }
        );

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user.id)} ${text ? "Added" : "Removed"} Text Input Command.`,
            flags: MessageFlags.Ephemeral,
        });
    }
};
