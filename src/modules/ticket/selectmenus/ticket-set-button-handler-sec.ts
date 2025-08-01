import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    MessageFlags,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "ticket-set-button-handler-sec",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const message = await interaction.channel?.messages.fetch(
            interaction.message.reference.messageId
        );

        for (const value of interaction.values) {
            const role = interaction.guild?.roles.cache.get(value);

            const content = message?.content.split("|");
            if (!content) throw new Error("Message content is not a string");

            await database.ticketSetups.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                        CustomId: content[2],
                    },
                    data: {
                        Handlers: {
                            set: [role?.id]
                        },
                    }
                }
            );

            const data = await database.ticketSetups.findFirst({
                where: {
                    CustomId: content[2],
                }
            });

            if (!client.user) throw new Error("Client user is not defined");
            interaction.reply({
                content: `## ${await convertToEmojiPng("info", client.user?.id)} Enable Shadow-Ping for ${role} or do nothing (Dissmiss this message)`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket-set-button-handler-ping:" + data?.CustomId)
                            .setLabel("Enable Ping")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:bell:1329513059789832242>")
                            .setDisabled(false)
                    ),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
