import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, ChannelSelectMenuBuilder,
    Client, ContainerBuilder,
    EmbedBuilder,
    MessageFlags, PermissionsBitField, RoleSelectMenuBuilder, TextDisplayBuilder, UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {GuildPermissionType} from "../../../enums/permissionType.js";
import {randomUUID} from "crypto";
import {ExtendedClient} from "../../../types/client.js";

export default {
    id: "permissions-view-user-permissions",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: UserSelectMenuInteraction, client: ExtendedClient) {
        for (const value of interaction.values) {
            const user = await interaction.guild.members.fetch(value)

            const bitField = new PermissionsBitField(user.permissions)
            const permissionsString = bitField.toArray()

            await interaction.reply({
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(
                                        [
                                            `## ${await convertToEmojiToPng("user")} Permissions Info of ${user}`,
                                            ``,
                                            `### All Permissions:`,
                                            `> ${permissionsString.map((p) => ` \`${p}\` `)}`,
                                            ``,
                                            `### Role Permissions:`,
                                            ``,
                                            `${user.roles.cache.map((r) =>
                                                `\n> **Role**: ${r} (${r.id})\n> **Permissions**:\n> - ${
                                                    r.permissions?.toArray()?.map(p => `${p}`).join(", ") || "N/A"
                                                }\n`
                                            ).join("").length > 1000 ?
                                                ("This user has too many roles with permissions to Display") :
                                                (user.roles.cache.map((r) =>
                                                    `\n> **Role**: ${r} (${r.id})\n> **Permissions**:\n> - ${
                                                        r.permissions?.toArray()?.map(p => `${p}`).join(", ") || "N/A"
                                                    }\n`
                                                ).join(""))}`
                                        ].join("\n")
                                    )
                            )
                    ]
                }
            )

        }
    }
};
