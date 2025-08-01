import {ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    subCommandGroup: "bot.permissions.reset",

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });
        const {guild} = interaction;
        if (!guild) return;

        const system = interaction.options.getString("system") as PermissionType;

        let db = await database.permissions.findFirst({
            where: {
                GuildId: guild.id
            }
        });
        if (!db) {
            db = await database.permissions.create({
                data: {
                    GuildId: guild.id,
                    Permissions: []
                }
            });
        }

        const before = db.Permissions.length;
        const index = db.Permissions.findIndex(p => p.Type === system);

        await database.permissions.update(
            {
                where: {
                    GuildId: guild.id
                },
                data: {
                    Permissions: {
                        set: db.Permissions.splice(index, 1)
                    }
                }
            }
        )

        const after = db.Permissions.length;

        if (!client.user) throw new Error("Client user is not defined");
        if (before == after) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} There is no permission set for **${system}**.`,
            });
        }

        return interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Permission for **${system}** has been reset.`,
        });
    }
};
