import {ButtonStyle, Client, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionrole-manage-roles",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.reactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (!client.user) throw new Error("Client user is not cached");
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No data found`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.reactionRoles.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    Roles: []
                }
            }
        )
        ;

        for (const role of interaction.values) {
            const guildRole = await interaction.guild?.roles.fetch(role);

            if (guildRole?.managed) {
                continue;
            }

            if (
                guildRole?.position &&
                interaction.guild?.members.me?.roles.highest.position &&
                guildRole.position >=
                interaction.guild.members.me.roles.highest.position
            ) {
                if (!client.user) throw new Error("Client user is not cached");
                interaction.update({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't use ${guildRole} role because it's higher than my highest role.`,
                    components: []
                });
            }

            await database.reactionRoles.update(
                {
                    where: {UUID: uuid},
                    data: {
                        Roles: {
                            push: role
                        }
                    }
                }
            );
        }

        if (!client.user) throw new Error("Client user is not cached");
        await interaction.update({
            content: `## ${await convertToEmojiPng("role", client.user?.id)} Roles updated successfully for the reaction-role with the ID \`${uuid}\``,
            components: []
        });
    }
};
