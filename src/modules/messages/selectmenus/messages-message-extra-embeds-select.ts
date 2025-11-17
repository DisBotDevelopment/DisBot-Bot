import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    EmbedBuilder,
    MessageFlags,
    TextChannel,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-message-extra-embeds-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.messageTemplates.findFirst({
            where: {
                Name: uuid
            }
        });

        for (const value of interaction.values) {
            const embed = data.OtherEmbeds.filter((e, i) => i == Number(value)).map((e) => e);

            await interaction.reply({
                flags: MessageFlags.Ephemeral,
                embeds: [new EmbedBuilder(JSON.parse(embed[0]))],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("messages-embed-create:" + uuid + ":" + "isExtra" + ":" + "isExtraEdit")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:edit:1259961121075626066>")
                            .setLabel("Edit Embed"),
                        new ButtonBuilder()
                            .setCustomId("messages-message-extra-embeds-delete:" + uuid + ":" + value)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:trash:1259432932234367069>")
                            .setLabel("Delete Embed")
                    )]

            })
        }
    }
}
