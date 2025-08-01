import {
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ChannelType, ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "giveaway-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined");
        const description = interaction.fields.getTextInputValue("giveaway-description");
        const time = interaction.fields.getTextInputValue("giveaway-duration") || "No duration";
        const prize = interaction.fields.getTextInputValue("giveaway-prize") || "No prize";
        const winner = interaction.fields.getTextInputValue("giveaway-winner") || "No winner";
        const requirements = interaction.fields.getTextInputValue("giveaway-requirements") || "No requirements";

        let role = interaction.guild?.roles.cache.find(r => r.name === requirements);


        const uuids = randomUUID()

        await database.giveaways.create({
            data: {
                MessageId: uuids,
                ChannelId: null,
                Prize: prize,
                Winners: Number(winner),
                Time: time,
                Ended: false,
                WinnerIds: [],
                HostedBy: interaction.user.id,
                MessageTemplate: null,
                Entrys: [],
                Requirements: role?.id ? [role?.id] : [],
                UUID: uuids,
                CreatedAt: new Date(),
                EndedAt: null,
                EndedBy: null,
                Paused: false,
                EndedMessage: null,
                Rerolled: false,
                WinnerMessageTemplate: null,
                Content: description,
                Guilds: {
                    connect: {GuildId: interaction.guild.id}
                }
            }
        });


        await interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} Giveaway created! Please confirm the giveaway and send it to the channel.`,
            flags: MessageFlags.Ephemeral,
            components: [
                new ActionRowBuilder<ChannelSelectMenuBuilder>()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId("giveaway-channel:" + uuids)
                            .setPlaceholder("Select a channel")
                            .setChannelTypes([ChannelType.GuildText, ChannelType.PublicThread, ChannelType.GuildAnnouncement, ChannelType.AnnouncementThread, ChannelType.GuildForum])
                            .setMinValues(1)
                            .setMaxValues(1)
                    )
            ]
        });
    }
}