import {
    ChannelSelectMenuInteraction,
    EmbedBuilder,
    GuildTextBasedChannel, MessageFlags,
    SendableChannels,
    TextChannel,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {parseComponentData} from "../../../helper/messageHelper.js";

export default {
    id: "messages-send-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChannelSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.messageTemplates.findFirst({
            where: {
                Name: uuid
            }
        });

        if (data.IsComponentsV2Message) {
            for (const value of interaction.values) {
                const channel = await interaction.guild?.channels.fetch(value);
                const json = await parseComponentData(data.ComponentJSON)

                await (channel as TextChannel).send({
                    flags: MessageFlags.IsComponentsV2,
                    components: json.components,
                    files: json.files.length > 0 ? json.files : []
                })

                await interaction.deferUpdate();
            }
        } else {
            let extraEmbeds: EmbedBuilder[] = []

            if (data.OtherEmbeds) {
                extraEmbeds = data.OtherEmbeds.map((embed) => new EmbedBuilder(JSON.parse(embed)));
            }

            for (const value of interaction.values) {
                const channel = interaction.guild?.channels.cache.get(value);
                if (data?.EmbedJSON) {
                    await (channel as TextChannel).send({
                        content: data?.Content ? data.Content : " ",
                        embeds: [new EmbedBuilder(JSON.parse(data.EmbedJSON)), ...extraEmbeds]
                    });
                } else {
                    await (channel as TextChannel).send({
                        content: data?.Content ? data.Content : ""
                    });
                }

                await interaction.deferUpdate();
            }
        }
    }
};
