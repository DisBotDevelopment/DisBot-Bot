import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ContainerBuilder, ContainerComponent, EmbedBuilder, FileBuilder, Message, MessageFlags, StringSelectMenuBuilder, TextDisplayBuilder, UserSelectMenuInteraction } from "discord.js";
import { ExtendedClient } from "../../../types/client.js";

export default {
    id: "messages-embed-clearmessage",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ButtonInteraction,
        client: ExtendedClient
    ) {
        const messageId = interaction.customId.split(":")[1];
        const message = await interaction.channel?.messages.fetch(messageId);

        await message?.delete();

        interaction.update({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `**The Embed was cleard from the Channel!**`
                        )
                    )
            ],
            flags: MessageFlags.IsComponentsV2,
        });

    }
};