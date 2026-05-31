import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder,
    TextDisplayBuilder
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import Parser from "rss-parser";

export default {
    id: "youtube-add-channelid-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined");

        const uuids = randomUUID();

        const youtubeChannelId = interaction.fields.getTextInputValue(
            "channelid"
        );

        try {
            const parser = new Parser()
            const videoData = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`
            );
            // @ts-ignore
            const {author} = videoData.items[0];
        } catch (e) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Youtube Channel found with this ID!`, interaction, true)
        }

        const data = await database.guildYoutubeNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                YoutubeChannelId: youtubeChannelId
            }
        });

        if (data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("info")} You have already added this channel name.`, interaction, true)
        }

        await database.guildYoutubeNotifications.create({
            data: {
                Guilds: {
                    connect: {
                        GuildId: interaction.guild?.id
                    }
                },
                YoutubeChannelId: youtubeChannelId,
                ChannelId: "",
                MessageTemplateId: "",
                PingRoles: [],
                UUID: uuids,
                Latest: []
            }
        });

        const role = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("youtube-add-role:" + uuids)
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("Select your Ping Role")
        );

        const channel =
            new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                new ChannelSelectMenuBuilder()
                    .addChannelTypes(
                        ChannelType.GuildText,
                        ChannelType.PublicThread,
                        ChannelType.PrivateThread,
                        ChannelType.GuildAnnouncement
                    )
                    .setCustomId(
                        "youtube-add-channel:" + uuids
                    )
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Select your Channel/Thread")
            );

        const message = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "youtube-add-message:" + uuids
                )
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Message Template")
                .setEmoji("<:addchannel:1324458759589728387>")
        );

        await interaction.reply({
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# ${await convertToEmojiToPng("role")} **Please select a Role to ping member.**`)
                    )
                    .addActionRowComponents(role)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# ${await convertToEmojiToPng("add")} **Select a Channel to send your Notification.**`)
                    )
                    .addActionRowComponents(channel)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# ${await convertToEmojiToPng("message")} **Select a Message Template for the Notification.**`)
                    )
                    .addActionRowComponents(message)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("check")} When your are done please dismiss the Message.`)
                    )
            ],
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
        });
    }
};
