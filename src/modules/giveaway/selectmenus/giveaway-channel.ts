import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client, ContainerBuilder,
    EmbedBuilder, GuildTextBasedChannel,
    MessageFlags, TextBasedChannel, TextDisplayBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import moment from "moment";
import ms from "ms";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "giveaway-channel",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {
            if (!client.user) throw new Error("Client user is not defined");

            const uuid = interaction.customId.split(":")[1];
            const data = await database.giveaways.findFirst({
                where: {
                    UUID: uuid,
                    GuildId: interaction.guild?.id
                }
            });

            if (!data) await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No data found!`,
                flags: MessageFlags.Ephemeral
            });


            const channel = interaction.guild?.channels.cache.get(value) as GuildTextBasedChannel
            if (!channel?.isSendable()) return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} I cannot send messages in this channel!`,
                flags: MessageFlags.Ephemeral
            })


            const duration = ms(data.Time as ms.StringValue)
            const createdAt = Date.now()
            const endTime = moment(createdAt).add(duration, "milliseconds").toDate()
            const timeStamp = Math.floor(endTime.getTime() / 1000)


            const message = await (channel as GuildTextBasedChannel).send({
                components: [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(data.Content.replace("{action.message}", ``).replace("{prize}", data.Prize as string).replace("{winner}", String(data.Winners)).replace("{requirements}", data.Requirements[0] ? `<@&${data.Requirements[0]}>` : "No requirements").replace("{hostedBy}", `<@${data.HostedBy}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", data.Entrys ? data.Entrys.length.toString() : "N/A")
                            )).addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`giveaway-enter:${data.UUID}`)
                            .setEmoji("<:giveaway:1366020996934668419>")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(false)
                    )),
                ], flags: MessageFlags.IsComponentsV2,
            })


            await database.giveaways.update({
                where: {
                    UUID: uuid,
                    GuildId: interaction.guild?.id
                },
                data: {
                    ChannelId: value,
                    MessageId: message.id,
                }
            });

            await interaction.update({
                content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} Giveaway successfully created in ${message.url}`,
                embeds: [],
                components: [],
            });
        }
    }
};
