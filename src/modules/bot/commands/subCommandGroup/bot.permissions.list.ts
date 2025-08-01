import {ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    subCommandGroup: "bot.permissions.list",

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        const {guild} = interaction;


        let db = await database.permissions.findFirst({
            where: {
                GuildId: guild?.id
            }
        });
        if (!db) {
            db = await database.permissions.create({
                data: {
                    GuildId: guild?.id,
                    Permissions: []
                }
            });
        }

        if (!client.user) throw new Error("Client user is not defined");
        if (!db.Permissions.length || !db) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} There are no permissions set for **${guild?.name}**.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const list = db.Permissions
            .map((p) => `**${p.Type}**: <@&${p.RoleId}>`)
            .join("\n");

        return interaction.reply({
            content: `## ${await convertToEmojiPng("list", client.user?.id)} Permissions for **${guild?.name}**:\n${list}`,
            flags: MessageFlags.Ephemeral
        });
    }
};
