import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder, Embed, EmbedBuilder,
    MessageFlags, StringSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-message-extra-embeds-list",

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

        await interaction.reply(
            {
                flags: MessageFlags.Ephemeral,
                embeds: data.OtherEmbeds.map(embed => {
                    return new EmbedBuilder(JSON.parse(embed))
                }),
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("messages-message-extra-embeds-select:" + interaction.customId.split(":")[1])
                            .setPlaceholder("Select a Embed to manage")
                            .setOptions(
                                data.OtherEmbeds.map((embed, int) => {
                                    return {
                                        label: new EmbedBuilder(JSON.parse(embed)).data.title ?? "N/A",
                                        value: String(int),
                                        description: new EmbedBuilder(JSON.parse(embed)).data.description ?? "N/A",
                                        emoji: "<:message:1322252985702551767>"
                                    }
                                }),)
                    )
                ]
            }
        )


    }
};
