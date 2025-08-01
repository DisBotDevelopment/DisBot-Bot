import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import moment from "moment";
import ms from "ms";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "giveaway-leave",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined");

        const giveaway = await database.giveaways.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1],
            }
        });

        if (!giveaway) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} Giveaway not found!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (giveaway.Ended) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} This giveaway has already ended!`,
                flags: MessageFlags.Ephemeral,
            });
        }


        const message = await interaction.channel?.messages.fetch(giveaway?.MessageId as string)

        await database.giveaways.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                Entrys: {
                    set: giveaway?.Entrys.filter((r) => r != interaction.user.id),
                }
            }
        })


        const duration = ms(giveaway.Time as ms.StringValue)
        const createdAt = giveaway.CreatedAt
        const endTime = moment(createdAt).add(duration, "milliseconds").toDate()

        const timeStamp = Math.floor(endTime.getTime() / 1000)

        const updatedGiveaway = await database.giveaways.findFirst({
            where: {
                ChannelId: interaction.channel?.id,
                MessageId: interaction.message.id,
                GuildId: interaction.guild?.id
            }
        });

        await message.edit({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(giveaway.Content.replace("{action.message}", ``).replace("{prize}", giveaway.Prize as string).replace("{winner}", String(giveaway.Winners)).replace("{requirements}", giveaway.Requirements[0] ? `<@&${giveaway.Requirements[0]}>` : "No requirements").replace("{hostedBy}", `<@${giveaway.HostedBy}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", updatedGiveaway?.Entrys ? updatedGiveaway.Entrys.length.toString() : "N/A")
                        )).addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`giveaway-enter:${giveaway.UUID}`)
                        .setEmoji("<:giveaway:1366020996934668419>")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false)
                )),

            ],
            flags: MessageFlags.IsComponentsV2,
        })

        await interaction.update({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} You have left the giveaway!`,
            components: []
        });
    }
};
