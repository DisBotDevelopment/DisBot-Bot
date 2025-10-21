import {ActionRowBuilder, MessageFlags, ModalSubmitInteraction, RoleSelectMenuBuilder} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";


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
            "twitch-add-channelname"
        );

        const data = await database.guildTwitchNotifications.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                TwitchChannelName: getChannelName
            }
        });

        if (data) {
            return interaction.reply({
                embeds: [],
                components: [],
                content: `## ${await convertToEmojiToPng(
                    "info"
                )} You have already added this channel name.`,
                flags: MessageFlags.Ephemeral
            });
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


        const row = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId("twitch-add-role:" + uuids)
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder("Select your Ping Role")
        );

        interaction.reply({
            content: `## ${await convertToEmojiToPng(
                "text"
            )} Please select a Role to ping member.`, components: [row], flags: MessageFlags.Ephemeral
        });
    }
};
