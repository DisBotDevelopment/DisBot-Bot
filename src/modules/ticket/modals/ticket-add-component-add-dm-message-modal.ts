import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-add-dm-message-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.fields.getTextInputValue(
            "message"
        );

        const menuID = interaction.customId.split(":")[1];

        const message = await database.messageTemplates.findFirst({
            where: {
                Name: uuid
            }
        });

        if (uuid && !message) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} Message Template with name \`${uuid}\` was not found.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.ticketSetups.update(
            {
                where: {
                    GuildId: interaction.guild?.id,
                    CustomId: menuID
                },
                data: {
                    UserDMWhenCloseMessageTemplateId: uuid ?? null
                }
            }
        );

        await interaction.deferUpdate();
    }
};
