import {ButtonInteraction, ButtonStyle, EmbedBuilder, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

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

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        })


        await sendDefaultMessage(
            [
                `## ${await convertToEmojiToPng("analytics")} Vanity URL Analytics`,
                ``,
                `### Global Statistics`,
                ``,
                `${await convertToEmojiToPng("clicks")} **Total Clicks**: \`${data?.Analytics?.Click}\``,
                `${await convertToEmojiToPng("clicks")} **Total Unique Clicks**: \`${data?.Analytics?.UniqueClick}\``,
                `${await convertToEmojiToPng("group")} **Joined Server**: \`${data?.Analytics?.JoinedWithCode}\``,
                `${await convertToEmojiToPng("created")} **Created At**: <t:${Math.floor(data?.CreatedAt.getTime() as number / 1000)}:R>`,
                `### 30 Days Statistics`,
                ``,
                `${await convertToEmojiToPng("clicks")} **Total Clicks**: \`${data?.Analytics?.Latest30Days?.Click}\``,
                `${await convertToEmojiToPng("clicks")} **Total Unique Clicks**: \`${data?.Analytics?.Latest30Days?.UniqueClick}\``,
                `${await convertToEmojiToPng("group")} **Joined Server**: \`${data?.Analytics?.Latest30Days?.JoinedWithCode}\``,
                `${await convertToEmojiToPng("calendar")} **Date**: <t:${Math.floor(data?.Analytics?.Latest30Days?.Date?.getTime() as number / 1000)}:R>`,
                `${await convertToEmojiToPng("calendarupdate")} **Last Updated**: <t:${Math.floor(data?.Analytics?.Update?.getTime() as number / 1000)}:R>`,
            ].join("\n"), interaction, true, "deferReply"
        )

    }
};
