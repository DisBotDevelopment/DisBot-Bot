import axios from "axios";
import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ChannelSelectMenuBuilder, ChannelType, ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder, TextDisplayBuilder
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "spotify-add-channelname-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client user not found");
        const channelName = interaction.fields.getTextInputValue("channelName");

        const spotifyToken = await database.disBot.findFirst({
            where: {
                GetConf: "config"
            }
        })

        const spotifyChannel = await axios.get(`https://api.spotify.com/v1/shows/${channelName}`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyToken?.SpotifyToken}`
                }
            }
        )

        const data = await database.guildSpotifyNotifications.findFirst({
            where: {
                ShowId: channelName
            }
        });
        if (data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("info")} You have already added this channel name.`, interaction, true)
        }

        if (spotifyChannel.status != 200) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No Channel found`, interaction, true)
        }

        const uuids = randomUUID();

        await database.guildSpotifyNotifications.create({
            data: {
                Guilds: {
                    connect: {
                        GuildId: interaction.guild?.id
                    }
                },
                ChannelId: "",
                Latests: [],
                ShowId: channelName,
                MessageTemplateId: "",
                PingRoles: [],
                UUID: uuids,
            }
        })

        const role = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("spotify-add-role:" + uuids)
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
                        "spotify-add-channel:" + uuids
                    )
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Select your Channel/Thread")
            );

        const message = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "spotify-message:" + uuids
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
