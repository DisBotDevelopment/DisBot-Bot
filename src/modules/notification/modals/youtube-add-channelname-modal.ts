import {ActionRowBuilder, ButtonStyle, MessageFlags, ModalSubmitInteraction, RoleSelectMenuBuilder} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "youtube-add-channelname-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined");

        const uuids = uuid();

        const getChannelName = interaction.fields.getTextInputValue(
            "youtube-add-channelname"
        );

        const data = await database.youtubeNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                YoutubeChannelId: getChannelName
            }
        });

        if (data) {
            return interaction.reply({
                embeds: [],
                components: [],
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} You have already added this channel id.`
                , flags: MessageFlags.Ephemeral
            });
        }

        await database.youtubeNotifications.create({
            data: {
                GuildId: interaction.guild?.id,
                YoutubeChannelId: getChannelName,
                ChannelId: null,
                MessageTemplateId: null,
                PingRoles: [],
                UUID: uuids,
                Latest: []
            }
        });

        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("youtube-add-role:" + uuids)
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("Select your Ping Role")
        );

        interaction.reply({
            content: `## ${await convertToEmojiPng(
                "text",
                client.user.id
            )} Please select a Role to ping member.`, components: [row], flags: MessageFlags.Ephemeral
        });
    }
};
