import {ButtonInteraction, EmbedBuilder} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "api-guild",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user not found");
        if (interaction.user.id != interaction.guild?.ownerId) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You are not the owner of this server`,
                flags: "Ephemeral",
            });
        }

        const data = await database.apis.findFirst({
            where: {
                UserId: interaction.user.id
            }
        });

        if (!data) {
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You don't have an API Account`,
                flags: "Ephemeral",
            });
        }

        if (data.Guilds.includes(interaction.guild.id)) {
            await database.apis.updateMany({
                    where: {
                        UserId: interaction.user.id,
                    },
                    data: {
                        Guilds: data.Guilds.filter(guildId => guildId !== interaction.guild.id),
                    }
                },
            );


            return await interaction.update({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Removed this server from your API Account`,
            });
        } else {
            await database.apis.updateMany({
                where: {
                    UserId: interaction.user.id,
                },
                data: {
                    Guilds: [...data.Guilds, interaction.guild.id],
                }
            });

            return await interaction.update({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Added this server to your API Account`,
            });
        }

    }
}