import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder,
    Message,
    MessageFlags, TextDisplayBuilder,
    TextInputStyle
} from "discord.js";
import moment from "moment";
import ms from "ms";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "giveaway-enter",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined");
        const message = interaction.message
        const giveaway = await database.giveaways.findFirst({
            where: {
                ChannelId: interaction.channel?.id,
                MessageId: interaction.message.id,
                GuildId: interaction.guild?.id
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

        if (giveaway.Requirements[0] != null && giveaway.Requirements[0] != undefined && giveaway.Requirements[0] != "" && giveaway.Requirements[0] != "null") {
            if (giveaway.Requirements.length >= 1 && !interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.has(giveaway.Requirements[0])) {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} You need to have the role <@&${giveaway.Requirements[0]}> to enter this giveaway!`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        if (giveaway?.Entrys.includes(interaction.user.id)) {
            const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("giveaway-leave:" + giveaway?.UUID)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:logout:1366028331635576862>")
            );

            return interaction.reply({
                content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} You are already entered in the giveaway!`,
                flags: MessageFlags.Ephemeral,
                components: [button]
            });
        }

        await database.giveaways.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                Entrys: {
                    push: interaction.user.id
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
                        .setContent(giveaway.Content.replace("{action.message}", ``).replace("{prize}", giveaway.Prize as string).replace("{winner}", String(giveaway.Winners)).replace("{requirements}", giveaway.Requirements[0] ? `<@&${giveaway.Requirements[0]}>` : "No requirements").replace("{hostedBy}", `<@${giveaway.HostedBy}>`).replace("{duration}", `<t:${timeStamp}:R>`).replace("{entrys}", updatedGiveaway.Entrys ? updatedGiveaway.Entrys.length.toString() : "N/A")
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

        return interaction.reply({
            content: `## ${await convertToEmojiPng("giveaway", client.user?.id)} You have entered the giveaway!`,
            flags: MessageFlags.Ephemeral,
        });
    }
};
