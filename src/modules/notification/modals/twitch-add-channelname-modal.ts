import {ActionRowBuilder, MessageFlags, ModalSubmitInteraction, RoleSelectMenuBuilder} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";


export default {
    id: "twitch-add-channelname-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuids = uuid();
        if (!client.user) throw new Error("Client is not ready yet!");

        const getChannelName = interaction.fields.getTextInputValue(
            "twitch-add-channelname"
        );

        const data = await database.twitchNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                TwitchChannelName: getChannelName
            }
        });

        if (data) {
            return interaction.reply({
                embeds: [],
                components: [],
                content: `## ${await convertToEmojiPng(
                    "info",
                    client.user.id
                )} You have already added this channel name.`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.twitchNotifications.create({
            data: {
                GuildId: interaction.guild?.id,
                TwitchChannelName: getChannelName,
                ChannelId: null,
                Live: false,
                MessageTemplateId: null,
                PingRoles: [],
                UUID: uuids
            }
        });


        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("twitch-add-role:" + uuids)
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
