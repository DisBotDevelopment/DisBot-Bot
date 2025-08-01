import {ButtonInteraction, ButtonStyle, EmbedBuilder, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-analytics",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("The client is not ready");
        const data = await database.vanitys.findFirst({
            include: {
                Analytics: {
                    include: {
                        Latest30Days: true
                    }
                }
            },
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });


        const embed = new EmbedBuilder()
            .setDescription(
                [
                    `## ${await convertToEmojiPng("analytics", client.user?.id)} Vanity URL Analytics`,
                    ``,
                    `### Global Statistics`,
                    ``,
                    `${await convertToEmojiPng("clicks", client.user?.id)} **Total Clicks**: \`${data?.Analytics?.Click}\``,
                    `${await convertToEmojiPng("clicks", client.user?.id)} **Total Unique Clicks**: \`${data?.Analytics?.UniqueClick}\``,
                    `${await convertToEmojiPng("group", client.user?.id)} **Joined Server**: \`${data?.Analytics?.JoinedWithCode}\``,
                    `${await convertToEmojiPng("created", client.user?.id)} **Created At**: <t:${Math.floor(data?.CreatedAt.getTime() as number / 1000)}:R>`,
                    `### 30 Days Statistics`,
                    ``,
                    `${await convertToEmojiPng("clicks", client.user?.id)} **Total Clicks**: \`${data?.Analytics?.Latest30Days?.Click}\``,
                    `${await convertToEmojiPng("clicks", client.user?.id)} **Total Unique Clicks**: \`${data?.Analytics?.Latest30Days?.UniqueClick}\``,
                    `${await convertToEmojiPng("group", client.user?.id)} **Joined Server**: \`${data?.Analytics?.Latest30Days?.JoinedWithCode}\``,
                    `${await convertToEmojiPng("calendar", client.user?.id)} **Date**: <t:${Math.floor(data?.Analytics?.Latest30Days?.Date?.getTime() as number / 1000)}:R>`,
                    `${await convertToEmojiPng("calendarupdate", client.user?.id)} **Last Updated**: <t:${Math.floor(data?.Analytics?.Update?.getTime() as number / 1000)}:R>`,
                ].join("\n")
            )


        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        })

    }
};
