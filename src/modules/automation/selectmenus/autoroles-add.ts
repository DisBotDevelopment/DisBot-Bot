import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction,} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "guildAutoRoles-add",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });
        for (const value of interaction.values) {

            const role = interaction.guild?.roles.cache.get(value);
            if (!role) {
                if (!client.user) throw new Error("Client user is not cached.");
                return await interaction.editReply({
                    content: `## ${await convertToEmojiToPng("error")} Role not found`,
                });

            }
            if (role.managed) {
                if (!client.user) throw new Error("Client user is not cached.");
                return await interaction.editReply({
                    content: `## ${await convertToEmojiToPng("error")} Role is managed by another service`,
                });

            }
            if (role.position >= (interaction.guild?.members.me?.roles.highest.position ?? 0)) {
                if (!client.user) throw new Error("Client user is not cached.");
                return await interaction.editReply({
                    content: `## ${await convertToEmojiToPng("error")} Role is higher than my highest role`,
                });

            }

            const data = await database.guildAutoRoles.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                    RoleId: value
                }
            });

            if (data) {
                return await interaction.editReply({
                    content: `## ${await convertToEmojiToPng("error")} This role is already added!`,
                })
            }

            await database.guildAutoRoles.create(
                {
                    data: {
                        GuildId: interaction.guildId,
                        RoleId: value
                    }
                }
            );
        }

        if (!client.user) throw new Error("Client user is not cached.");
        return await interaction.editReply({
            content: `## ${await convertToEmojiToPng("check")} Role(s) added to AutoRoles successfully (${interaction.values.length} roles)`,
        });

    },
};
