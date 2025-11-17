import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "vanity-update-discover",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.vanitys.findFirst({
            include: {
                Embed: {
                    include: {
                        Author: true
                    }
                }
            },
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        const isOneGuild = await database.vanitys.findMany({
            where: {
                InDiscovery: true,
                GuildId: interaction.guildId
            }
        });

        if (isOneGuild.length >= 1) {

            await database.vanitys.update({
                where: {
                    UUID: interaction.customId.split(":")[1]
                },
                data: {
                    InDiscovery: false,
                }
            });

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Disabled Discovery for this Vanity (You only can have this guild once in the Discovery!)`, interaction, true, "reply")
        }

        if (!data.Embed || !data.Embed.Title || !data.Embed.Author || !data.Embed.Description || !data.Embed.ImageUrl)
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} You need for the Discovery Embed Title, Embed Author (All), Embed Description and the Embed Image!`, interaction, true, "reply")

        await database.vanitys.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                InDiscovery: true,
            }
        });

        return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Added this Vanity Url to the Discovery.`, interaction, true, "reply")
    }
};
