import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction,} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autoroles-add",

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
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Role not found`,
                });

            }
            if (role.managed) {
                if (!client.user) throw new Error("Client user is not cached.");
                return await interaction.editReply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Role is managed by another service`,
                });

            }
            if (role.position >= (interaction.guild?.members.me?.roles.highest.position ?? 0)) {
                if (!client.user) throw new Error("Client user is not cached.");
                return await interaction.editReply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} Role is higher than my highest role`,
                });

            }

            const data = await database.autoRoles.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                    RoleId: value
                }
            });

            if (data) {
                return await interaction.editReply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} This role is already added!`,
                })
            }

            await database.autoRoles.create(
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
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Role(s) added to autoroles successfully (${interaction.values.length} roles)`,
        });

    },
};
