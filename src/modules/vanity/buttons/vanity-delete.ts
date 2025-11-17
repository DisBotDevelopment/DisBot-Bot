import {ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-delete",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.vanitys.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!client.user) throw new Error("Client is not ready");

        if (!data) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("info")} This vanity URL is not found.`, interaction, true, "reply")
        }

        await database.vanityEmbedAuthor.deleteMany({
            where: {
                VanityEmbedsId: data.UUID
            }
        })
        await database.vanityEmbed.deleteMany({
            where: {
                VanityId: data.UUID
            }
        })
        await database.vanityAnalyticsLatest30Day.deleteMany({
            where: {
                VanityAnalyticsId: data.UUID
            }
        })
        await database.vanityAnalytic.deleteMany({
            where: {
                VanityId: data.UUID
            }
        })
        await database.vanitys.deleteMany({
            where: {
                UUID: data.UUID
            }
        });

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Vanity URL has been deleted successfully.`, interaction, true, "update")
    }
};
