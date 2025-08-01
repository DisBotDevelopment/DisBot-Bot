import {ButtonInteraction, EmbedBuilder} from "discord.js";
import pkg from "short-uuid";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {randomUUID} from "crypto";

export default {
    id: "api-create",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");
        const data = await database.apis.findFirst({
            where: {
                UserId: interaction.user.id
            }
        })

        if (!data) {
            await database.apis.create({
                data: {
                    UserId: interaction.user.id,
                    Key: randomUUID(),
                    Flags: [],
                    Guilds: [],
                }
            });

            const newData = await database.apis.findFirst({
                where: {
                    UserId: interaction.user.id
                }
            })


            const embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription([
                    `## ${await convertToEmojiPng("route", client.user.id)} DisBot API Service`,
                    ``,
                    `-# Please keep in mind that this feature is still in development and may change in the future.`,
                    `${await convertToEmojiPng("key", client.user.id)} **API Key**: \`${newData.Key}\``,
                    `${await convertToEmojiPng("flag", client.user.id)} **API Flags**: ${newData.Flags.toString()}`,
                    `${await convertToEmojiPng("cuboid", client.user.id)} **Whitelisted Guilds**: ${newData.Guilds.toString()}`,
                ].join("\n"));

            await interaction.update({
                embeds: [embed],
                content: `## ${await convertToEmojiPng("refresh", client.user.id)} Created your API Key for https://api.disbot.app`,
            });
            return;
        }

        await database.apis.updateMany({
            where: {
                UserId: interaction.user.id,
            },
            data: {
                Key: randomUUID(),
            },
        });

        const newData = await database.apis.findFirst({
            where: {
                UserId: interaction.user.id
            }
        })


        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription([
                `## ${await convertToEmojiPng("route", client.user.id)} DisBot API Service`,
                ``,
                `${await convertToEmojiPng("key", client.user.id)} **API Key**: \`${newData?.Key}\``,
                `${await convertToEmojiPng("flag", client.user.id)} **API Flags**: ${newData?.Flags.toString()}`,
                `${await convertToEmojiPng("cuboid", client.user.id)} **Whitelisted Guilds**: ${newData?.Guilds.toString()}`,
            ].join("\n"));

        await interaction.update({
            embeds: [embed],
            content: `## ${await convertToEmojiPng("refresh", client.user.id)} Regenerated your API Key for https://api.disbot.app`,
        });
    }
};
