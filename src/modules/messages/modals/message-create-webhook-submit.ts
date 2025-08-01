import {EmbedBuilder, ModalSubmitInteraction, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "message-create-webhook-submit",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1]
            }
        });

        const webhook = interaction.fields.getTextInputValue(
            "message-create-webhook-options-webhook"
        );

        const webhooClient = new WebhookClient({
            url: webhook
        });

        if (data?.EmbedJSON) {
            webhooClient.send({
                content: data.Content ? data.Content : "",
                embeds: [new EmbedBuilder(JSON.parse(data.EmbedJSON))]
            });
        } else {
            webhooClient.send({content: data?.Content ? data.Content : ""});
        }

        interaction.deferUpdate();
    }
};
