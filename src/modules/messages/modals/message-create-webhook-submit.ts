import {EmbedBuilder, MessageFlags, ModalSubmitInteraction, SendableChannels, WebhookClient} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {parseComponentData} from "../../../helper/messageHelper.js";

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

        const webhookClient = new WebhookClient({
            url: webhook
        });

        if (data.IsComponentsV2Message) {
            const json = await parseComponentData(data.ComponentJSON)

            await webhookClient.send({
                withComponents: true,
                flags: MessageFlags.IsComponentsV2,
                components: json.components,
                files: json.files.length > 0 ? json.files : []
            })
        } else {
            let extraEmbeds: EmbedBuilder[] = []

            if (data.OtherEmbeds) {
                extraEmbeds = data.OtherEmbeds.map((embed) => new EmbedBuilder(JSON.parse(embed)));
            }

            if (data?.EmbedJSON) {
                await webhookClient.send({
                    content: data.Content ? data.Content : "",
                    embeds: [new EmbedBuilder(JSON.parse(data.EmbedJSON)), ...extraEmbeds]
                });
            } else {
                await webhookClient.send({content: data?.Content ? data.Content : ""});
            }

        }
        await interaction.deferUpdate();
    }
};
