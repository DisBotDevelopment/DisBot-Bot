import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-edit",

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
                .setLabel("Change Slug")
                .setCustomId(`vanity-change-slug:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:renamesolid24:1259433901554929675>"),
            new ButtonBuilder()
                .setLabel("Regenerate Invite")
                .setCustomId(`vanity-regenerate-invite:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:refresh:1260140823106813953>"),
            new ButtonBuilder()
                .setLabel("Enable/Disable Invite Logging for this Vanity URL")
                .setCustomId(`vanity-toggle-invite-logging:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:onoff:1376986390117482556>"),
            new ButtonBuilder()
                .setLabel("Update Embed")
                .setCustomId(`vanity-update-embed:${data?.UUID}`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:refresh:1260140823106813953>")
        )


        await interaction.deferReply({flags: MessageFlags.Ephemeral})
        if (!client.user) throw new Error("Client is not ready");

        if (!data) {
            await interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
            });
            return;
        }

        interaction.editReply({
            components: [row]
        })
    }
};
