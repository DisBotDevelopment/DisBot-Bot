import axios from "axios";
import {ActionRowBuilder, MessageFlags, ModalSubmitInteraction, RoleSelectMenuBuilder} from "discord.js";
import pkg from "short-uuid";

const {uuid} = pkg;
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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

        const data = await database.spotifyNotifications.findFirst({
            where: {
                ShowId: channelName
            }
        });
        if (data) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Channel Already Added to the Notification System`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (spotifyChannel.status != 200) {
            await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Spotify Channel Not Found`,
            });
            return;
        }
        const uuids = uuid();

        await database.spotifyNotifications.create({
            data: {
                GuildId: interaction.guild?.id,
                ChannelId: null,
                Latests: [],
                ShowId: channelName,
                MessageTemplateId: null,
                PingRoles: [],
                UUID: uuids,
            }
        })

        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Add ${spotifyChannel.data.name} Channel to the Notification System`,
            flags: MessageFlags.Ephemeral,
            components: [
                new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
                    new RoleSelectMenuBuilder()
                        .setCustomId("spotify-add-channelname-role:" + uuids)
                        .setPlaceholder("Select a Role to Notify")
                        .setMinValues(1)
                        .setMaxValues(10)
                )
            ]
        });


    }
};
