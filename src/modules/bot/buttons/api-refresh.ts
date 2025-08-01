import {ButtonInteraction, EmbedBuilder} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "api-refresh",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const data = await database.apis.findFirst({
            where: {
                UserId: interaction.user.id,
            }
        });
        if (!client.user) throw new Error("Client user not found");
        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription([
                `## ${await convertToEmojiPng("route", client.user?.id)} DisBot API Service`,
                ``,
                `${await convertToEmojiPng("key", client.user?.id)} **API Key**: \`${data?.Key}\``,
                `${await convertToEmojiPng("flag", client.user?.id)} **API Flags**: ${data?.Flags.toString()}`,
                `${await convertToEmojiPng("cuboid", client.user?.id)} **Whitelisted Guilds**: ${data?.Guilds.toString()}`,
            ].join("\n"))


        await interaction.update({
            embeds: [embed],
            content: `## ${await convertToEmojiPng("check", client.user.id)} Data has been refreshed`,
        });
    }
}