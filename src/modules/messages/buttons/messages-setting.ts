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
    id: "messages-setting",

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

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setEmoji("<:preview:1288230393757171825>")
                .setLabel("Message Preview")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("messages-preview:" + data?.Name),
            new ButtonBuilder()
                .setEmoji("<:edit:1259961121075626066>")
                .setLabel("Edit Message")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("messages-edit-message:" + data?.Name),
            new ButtonBuilder()
                .setEmoji("<:edit:1259961121075626066>")
                .setLabel("Edit Embed")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("messages-embed-create:" + data?.Name),
            new ButtonBuilder()
                .setEmoji("<:trash:1259432932234367069>")
                .setLabel("Delete Embed")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("messages-edit-embed-remove:" + data?.Name)
        );

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(row)
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    }
};
