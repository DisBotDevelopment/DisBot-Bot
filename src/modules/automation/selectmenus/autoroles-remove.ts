import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction,} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "guildAutoRoles-remove",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {
            await interaction.deferReply({
                flags: MessageFlags.Ephemeral,
            });

            const data = await database.guildAutoRoles.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                    RoleId: value
                }

            });

            if (!client.user) throw new Error("Client user is not cached.");
            if (!data) {
                await interaction.editReply({
                    content: `## ${await convertToEmojiToPng("error")} No AutoRoles data found`,
                });
                continue;
            } else {
                await database.guildAutoRoles.delete({
                    where: {
                        Id: data.Id
                    }
                })
            }
            await interaction.editReply({
                content: `## ${await convertToEmojiToPng("check")} Role(s) removed from AutoRoles successfully (${interaction.values.length})`,
            });
        }
    },
};
