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
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {replacePlaceholders} from "../../../main/placeholder.js";

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
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} Giveaway not found!`, interaction, true, "reply")
        }

        if (giveaway.Ended) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} This giveaway has already ended!`, interaction, true, "reply")
        }

        if (giveaway.Requirements[0] != null && giveaway.Requirements[0] != undefined && giveaway.Requirements[0] != "" && giveaway.Requirements[0] != "null") {
            if (giveaway.Requirements.length >= 1 && !interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.has(giveaway.Requirements[0])) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} You need to have the role <@&${giveaway.Requirements[0]}> to enter this giveaway!`, interaction, true, "reply")
            }
        }

        if (giveaway?.Entrys.includes(interaction.user.id)) {
            const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId("giveaway-leave:" + giveaway?.UUID)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:logout:1366028331635576862>")
            );

            return await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`## ${await convertToEmojiToPng("giveaway")} You are already entered in the giveaway!`,)
                        )
                        .addActionRowComponents(button)
                ]
            })
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

        const placeholderType = {
            giveaway: {
                action: {
                    message: ""
                },
                prize: giveaway.Prize as string,
                winner: String(giveaway.Winners),
                requirements: giveaway.Requirements[0] ? `<@&${giveaway.Requirements[0]}>` : "No requirements",
                hostedBy: `<@${giveaway.HostedBy}>`,
                duration: `<t:${timeStamp}:R>`,
                entrys: updatedGiveaway.Entrys ? updatedGiveaway.Entrys.length.toString() : "N/A"
            }
        }
        const gMessage = replacePlaceholders(giveaway.Content, placeholderType)

        await message.edit({
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(gMessage)
                )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`giveaway-enter:${giveaway.UUID}`)
                                .setEmoji("<:giveaway:1366020996934668419>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(false)
                        )
                    ),

            ],
            flags: MessageFlags.IsComponentsV2,
        })

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("giveaway")} You have entered the giveaway!`, interaction, true, "reply")
    }
};
