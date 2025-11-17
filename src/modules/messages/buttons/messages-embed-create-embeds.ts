import {
    ActionRowBuilder,
    ButtonBuilder, ButtonInteraction,
    ButtonStyle,
    ComponentBuilder,
    ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    TextDisplayBuilder,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "messages-embed-create-embeds",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const name = interaction.customId.split(":")[1]

        const data = await database.messageTemplates.findFirst({
            where: {Name: name,}
        });

        if (data.IsComponentsV2Message) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} You only can use Components in you Message!`, interaction, true)
        }

        if (!client.user) throw new Error("Client user is not cached");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("messages-embed-create:" + name)
                .setLabel("Add Main Embed")
                .setEmoji("<:add:1260157236043583519>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("messages-message-create:" + name)
                .setLabel("Set Message Content")
                .setEmoji("<:message:1322252985702551767>")
                .setStyle(ButtonStyle.Secondary),
        );

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("messages-message-save:" + name)
                .setLabel("Save Message Template")
                .setEmoji("<:save:1260157401496031244>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("messages-message-extra-embeds:" + name)
                .setLabel("Manage Extra Embeds")
                .setEmoji("<:box:1259853376368148601>")
                .setStyle(ButtonStyle.Secondary)
        )

        await interaction.reply({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`-# ${await convertToEmojiToPng(
                        "success"
                    )} Create your Embed Messages for the Message Template`)
                )
                    .addActionRowComponents(row)
                    .addActionRowComponents(row2),
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });
    },
};
