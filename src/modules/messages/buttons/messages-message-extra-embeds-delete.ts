import {ActionRowBuilder, ButtonInteraction, Message, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "messages-message-extra-embeds-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];
        const id = interaction.customId.split(":")[2];

        const data = await database.messageTemplates.findFirst({
            where: {
                Name: uuid
            }
        });
        const embed = data.OtherEmbeds.filter((e, i) => i != Number(id));

        await database.messageTemplates.update({
            where: {
                Name: uuid
            },
            data: {
                OtherEmbeds: {set: embed}
            }
        })

        await interaction.update({
            embeds: [],
            components: [],
            content: `## ${await convertToEmojiToPng("check")} Embed has been deleted successfully!`
        })
    }
};
