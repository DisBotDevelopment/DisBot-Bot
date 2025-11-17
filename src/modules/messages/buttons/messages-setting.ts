import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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
                .setCustomId("messages-preview:" + data?.Name)
        )

        let row2
        if (data.IsComponentsV2Message) {
            row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji("<:edit:1259961121075626066>")
                    .setLabel("Edit Components")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("messages-message-components:" + data?.Name)
            )
        } else {
            row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
                    .setCustomId("messages-message-extra-embeds:" + data.Name)
                    .setLabel("Add Extra Embeds")
                    .setEmoji("<:add:1260157236043583519>")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setEmoji("<:trash:1259432932234367069>")
                    .setLabel("Delete Embed")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("messages-edit-embed-remove:" + data?.Name)
            )
        }

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addActionRowComponents(row)
                    .addActionRowComponents(row2)
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    }
};
