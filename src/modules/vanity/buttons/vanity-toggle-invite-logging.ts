import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuBuilder, ChannelType,
    MessageFlags
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-toggle-invite-logging",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("The client is not ready");
        const data = await database.vanitys.findFirst({
            include: {
                Analytics: true
            },
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });


        if (!data) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)} This vanity URL is not found.`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (data.Analytics?.TrackInviteWithLog) {
            await database.vanityAnalytics.update(
                {
                    where: {VanityId: data.UUID},
                    data: {
                        TrackInviteWithLog: null
                    }
                }
            );
            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user.id)} Invite logging has been disabled for this vanity URL.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId(`vanity-toggle-invite-logging-select:${data.UUID}`)
                    .setPlaceholder("Select a channel to send the invite link")
                    .setChannelTypes([ChannelType.GuildText, ChannelType.GuildAnnouncement])
            )

        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`vanity-toggle-invite-logging-message:${data.UUID}`)
                    .setLabel("Add Message Template")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:message:1322252985702551767>️"),
            );

        await interaction.reply({
            components: [row, row2],
            flags: MessageFlags.Ephemeral,
        })


    }
};
