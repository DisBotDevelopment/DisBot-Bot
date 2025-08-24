import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

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

            return await interaction.reply(
                {
                    flags: MessageFlags.Ephemeral,
                    content: `## ${await convertToEmojiPng("error", client.user.id)} Disabled Discovery for this Vanity (You only can have this guild once in the Discovery!)`,
                }
            )
        }

        if (!data.Embed || !data.Embed.Title || !data.Embed.Author || !data.Embed.Description || !data.Embed.ImageUrl) return await interaction.reply(
            {
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} You need for the Discovery Embed Title, Embed Author (All), Embed Description and the Embed Image!`,
            }
        )


        await database.vanitys.update({
            where: {
                UUID: interaction.customId.split(":")[1]
            },
            data: {
                InDiscovery: true,
            }
        });


        await interaction.reply(
            {
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("check", client.user.id)} Added this Vanity Url to the Discovery.`,
            }
        )
    }
};
