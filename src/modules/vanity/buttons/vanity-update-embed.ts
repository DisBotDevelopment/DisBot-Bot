import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-update-embed",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Update Title")
                .setCustomId(`vanity-update-title:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:subtitle:1321938231788568586>"),
            new ButtonBuilder()
                .setLabel("Update Description")
                .setCustomId(`vanity-update-description:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:message:1322252985702551767>"),
            new ButtonBuilder()
                .setLabel("Update Image & Thumbnail")
                .setCustomId(`vanity-update-image:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:imageadd:1260148502449754112>"),
            new ButtonBuilder()
                .setLabel("Update Author")
                .setCustomId(`vanity-update-author:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:imageadd:1260148502449754112>"),
            new ButtonBuilder()
                .setLabel("Update Color")
                .setCustomId(`vanity-update-color:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:color:1321938714741440552>")
        )

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Add to Discovery")
                .setCustomId(`vanity-update-discover:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:toggleon:1301864515838672908>"),
            new ButtonBuilder()
                .setLabel("Show Embed")
                .setCustomId(`vanity-show-embed:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:preview:1288230393757171825>"),
        )


        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        if (!client.user) throw new Error("Client is not ready");

        if (!data) {
            await interaction.editReply({
                content: `## ${await convertToEmojiToPng("error")} This vanity URL is not found.`,
            });
            return;
        }

        await interaction.editReply({
            components: [row, row2]
        })
    }
};
