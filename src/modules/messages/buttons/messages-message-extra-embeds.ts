import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-message-extra-embeds",

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
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                components: [
                    new ContainerBuilder()
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId("messages-embed-create:" + interaction.customId.split(":")[1] + ":isExtra")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:add:1260157236043583519>")
                                    .setLabel("Add Embed"),
                                new ButtonBuilder()
                                    .setCustomId("messages-message-extra-embeds-list:" + interaction.customId.split(":")[1])
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji("<:list:1404137033496002591>")
                                    .setLabel("List Embed")
                            )
                        )
                ]
            }
        )


    }
};
