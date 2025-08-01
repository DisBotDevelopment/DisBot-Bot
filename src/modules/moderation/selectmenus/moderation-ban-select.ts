import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    GuildMemberRoleManager,
    MessageFlags,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "moderation-ban-select",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        try {
            if (!client.user) throw new Error("Client is not defined");

            const uuid = interaction.customId.split(":")[1];
            for (const value of interaction.values) {
                const data = await database.guildBans.findFirst({
                    where: {
                        UUID: uuid,
                    }
                });

                const user = await interaction.guild?.members.fetch(value);

                if (!client.user) throw new Error("Client is not defined");
                if (!user) {
                    interaction.reply({
                        content: `## ${await convertToEmojiPng("error", client.user?.id)} A user you selected is not in the server`,
                        flags: MessageFlags.Ephemeral,
                    });
                }

                if (
                    ((interaction.member?.roles instanceof GuildMemberRoleManager &&
                            interaction.member.roles.highest.position) ||
                        0) <= user.roles.highest.position
                ) {
                    interaction.reply({
                        content: `## ${await convertToEmojiPng("error", client.user?.id)} You can't ban a user with a higher or equal role`,
                        flags: MessageFlags.Ephemeral,
                    });
                }
                await database.guildBans.update(
                    {
                        where: {
                            UUID: uuid,
                        },
                        data: {
                            GuildId: interaction.guild?.id,
                            ModeratorId: interaction.user.id,
                            Banned: true,
                        }
                    }
                );

                await database.guildBans.update(
                    {
                        where: {
                            UUID: uuid,
                        }
                        ,
                        data: {
                            UserId: {
                                push: value
                            },
                        }
                    }
                );

                try {
                    if (data?.DmMessage)
                        await user.send({
                            content: data?.DmMessage.replace(
                                "{member.name}",
                                user.user.tag
                            )
                                .replace("{member.name}", user.user.username)
                                .replace("{member.tag}", `<@${user.id}>`)
                                .replace("{member.id}", user.id)
                                .replace("{guild.name}", interaction.guild?.name as string)
                                .replace("{guild.id}", interaction.guild?.id as string)
                                .replace("{reason}", data?.Reason ?? "No reason provided")
                                .replace("{time}", data?.Time ?? "No time provided")
                                .replace("{moderator.tag}", `<@${interaction.user.id}>`)
                                .replace("{moderator.id}", interaction.user.id)
                                .replace("{moderator.name}", interaction.user.username)
                                .replace(
                                    "{createdat}",
                                    new Date(data?.CreatedAt).toLocaleString()
                                ),

                            components: [
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel(
                                            "Server: " +
                                            interaction.guild?.name +
                                            " (" +
                                            interaction.guild?.id +
                                            ")"
                                        )
                                        .setURL(
                                            interaction.guild?.vanityURLCode
                                                ? "https://discord.gg/" +
                                                interaction.guild?.vanityURLCode
                                                : "https://No-Vanity-URL.com"
                                        )
                                ),
                            ],
                        });
                } catch (error) {
                    throw new Error(error as string);
                }

                await user.ban({
                    reason: data?.Reason ?? "No reason provided",
                });
            }
            interaction.update({
                content: `## ${await convertToEmojiPng(
                    "check",
                    client.user.id
                )} Successfully banned the user(s)`,
                components: [],
            });
        } catch (error) {
            if (!client.user) throw new Error("Client is not defined");
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} Check the permoissions and try again or ban the user manually (one by one)`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
