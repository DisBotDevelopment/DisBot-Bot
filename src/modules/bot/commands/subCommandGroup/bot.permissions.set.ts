import {ButtonStyle, ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    subCommandGroup: "bot.permissions.set",

    /**
     *
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
        const role = interaction.options.getRole("role");

        let db = await database.permissions.findFirst({
            where: {
                GuildId: guild.id
            }
        });
        if (!db) {
            db = await database.permissions.create({
                data: {
                    GuildId: interaction.guild.id,
                    Permissions: []
                }
            });
        }
        const existing = db.Permissions.find(p => p.Type === system as string);
        if (existing) {
            existing.RoleId = role!.id;
        } else {
            db.Permissions.push();
            await database.permissions.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    Permissions: {
                        push: {Type: system, RoleId: role!.id}
                    }
                }
            })
        }

        if (!client.user) throw new Error("Client user is not defined");
        return interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Permission for **${system}** has been set to <@&${role?.id}>`,
        });
    }
};
