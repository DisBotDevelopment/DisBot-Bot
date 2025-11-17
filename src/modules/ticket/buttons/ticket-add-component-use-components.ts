import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ContainerBuilder, MessageFlags,
    ModalBuilder,
    ModalSubmitInteraction, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-use-components",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]

        const data = await database.ticketSetups.findFirst({
            where: {
                CustomId: uuid
            }
        })


        await interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(
                                [
                                    `## ${await convertToEmojiToPng("puzzle")} Components V2`,
                                    ``,
                                    `-# If you want to use the ticket module with the Components V2 from Message Templates you can just do it.`,
                                    `-# Please copy the IDs below and paste it in your Component Editor.`,
                                    ``,
                                    `**Button**:`,
                                    `- Custom Id: \`ticket-create-button:${data.CustomId}\``,
                                    ``,
                                    `**SelectMenu**:`,
                                    `- Custom Id: \`ticket-create-selectmenu\``,
                                    `- Option Id: \`${data.CustomId}\``
                                ].join("\n"))
                    )

            ]
        })
    }
};
