import {ButtonStyle, ChannelType, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-message-content",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const content = interaction.fields.getTextInputValue("content");

        await database.messageTemplates.update(
            {
                where: {
                    Name: interaction.customId.split(":")[1]
                }, data: {Content: content}
            }
        );

        interaction.deferUpdate();
    }
};
