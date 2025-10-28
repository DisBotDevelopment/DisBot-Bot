import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType,
    ContainerBuilder,
    MessageFlags,
    ModalSubmitInteraction,
    RoleSelectMenuBuilder, TextDisplayBuilder
} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";
import {sendMessages} from "../../../api/disbot-api.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";


export default {
    id: "twitch-add-channelname-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuids = randomUUID();
        if (!client.user) throw new Error("Client is not ready yet!");

        const getChannelName = interaction.fields.getTextInputValue(
            "channelname"
        );

        const data = await database.guildTwitchNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                TwitchChannelName: getChannelName
            }
        });

        if (data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("info")} You have already added this channel name.`, interaction, true)
        }

        await database.guildTwitchNotifications.create({
            data: {
                Guilds: {
                    connect: {
                        GuildId: interaction.guild?.id
                    }
                },
                TwitchChannelName: getChannelName,
                ChannelId: "",
                Live: false,
                MessageTemplateId: "",
                PingRoles: [],
                UUID: uuids
            }
        });


        const role = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("twitch-add-role:" + uuids)
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
                        "twitch-add-channel:" + interaction.customId.split(":")[1]
                    )
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder("Select your Channel/Thread")
            );

        const message = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(
                    "twitch-add-message:" + interaction.customId.split(":")[1]
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
