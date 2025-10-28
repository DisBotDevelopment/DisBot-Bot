import {ButtonStyle, EmbedBuilder, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {parseComponentData} from "../../../helper/messageHelper.js";

export default {
    id: "messages-preview",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.messageTemplates.findFirst({
            where: {
                Name: interaction.customId.split(":")[1]
            }
        });


        if (data.IsComponentsV2Message) {
            const json = await parseComponentData(data.ComponentJSON)
            
            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: json.components,
                files: json.files.length > 0 ? json.files : []
            })
        } else {
            let extraEmbeds
                :
                EmbedBuilder[] = []

            if (data.OtherEmbeds) {
                extraEmbeds = data.OtherEmbeds.map((embed) => new EmbedBuilder(JSON.parse(embed)));
            }

            if (data?.EmbedJSON) {
                await interaction.reply({
                    content: data.Content ? data.Content : "-# No Content",
                    embeds: [new EmbedBuilder(JSON.parse(data.EmbedJSON)), ...extraEmbeds],
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: data?.Content ? data.Content : "-# No Content",
                    embeds: [new EmbedBuilder().setDescription("-# No Embed")],
                    flags: MessageFlags.Ephemeral
                });
            }
        }

    }
}
;
