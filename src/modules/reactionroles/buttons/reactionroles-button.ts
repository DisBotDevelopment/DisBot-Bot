import {ButtonInteraction, ButtonStyle, Client, EmbedBuilder, Message, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-button",

    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});
        const reactionroles = await database.reactionRoles.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!client.user) throw new Error("Client user is not cached");

        if (!reactionroles) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} OOps! I couldn't find the reaction role data.`
            });
        }

        const user = interaction.user;

        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) {
            return interaction.editReply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} OOps! You are not in the server.`
            });
        }

        const addMessageData = await database.messageTemplates.findFirst({
            where: {
                Name: reactionroles.AddMessage
            }
        });

        const removeMessageData = await database.messageTemplates.findFirst({
            where: {
                Name: reactionroles.RemoveMessage
            }
        });

        if (Array.isArray(reactionroles.Roles) && reactionroles.Roles.length > 0) {
            for (const role of reactionroles.Roles) {
                const guildRole = interaction.guild?.roles.cache.get(role);

                const allroles = reactionroles.Roles.map((r) => `<@&${r}>`);

                let addmessage: {
                    content: string;
                    embeds?: EmbedBuilder[];
                };

                let removemessage: {
                    content: string;
                    embeds?: EmbedBuilder[];
                };

                if (!addMessageData?.EmbedJSON) {
                    addmessage = {
                        content: addMessageData?.Content?.replace(
                            "{allroles}",
                            allroles.join(", ")
                        )
                            .replace("{member.tag}", `<@${user.id}>`)
                            .replace("{member.id}", user.id)
                            .replace("{member.username}", user.username) as string
                    };
                } else {
                    addmessage = {
                        content: addMessageData.Content?.replace(
                            "{allroles}",
                            allroles.toString()
                        )
                            .replace("{member.tag}", `<@${user.id}>`)
                            .replace("{member.id}", user.id)
                            .replace("{member.username}", user.username) as string,
                        embeds: [
                            new EmbedBuilder(
                                JSON.parse(
                                    addMessageData.EmbedJSON.replace(
                                        "{allroles}",
                                        allroles.toString()
                                    )
                                        .replace("{member.tag}", `<@${user.id}>`)
                                        .replace("{member.id}", user.id)
                                        .replace(
                                            "{member.username}",
                                            user.username
                                        ) as string as string
                                )
                            )
                        ]
                    };
                }

                if (!removeMessageData?.EmbedJSON) {
                    removemessage = {
                        content: removeMessageData?.Content?.replace(
                            "{allroles}",
                            allroles.join(", ")
                        )
                            .replace("{member.tag}", `<@${user.id}>`)
                            .replace("{member.id}", user.id)
                            .replace("{member.username}", user.username) as string
                    };
                } else {
                    removemessage = {
                        content: removeMessageData.Content?.replace(
                            "{allroles}",
                            allroles.toString()
                        )
                            .replace("{member.tag}", `<@${user.id}>`)
                            .replace("{member.id}", user.id)
                            .replace("{member.username}", user.username) as string,
                        embeds: [
                            new EmbedBuilder(
                                JSON.parse(
                                    removeMessageData.EmbedJSON.replace(
                                        "{allroles}",
                                        allroles.toString()
                                    )
                                        .replace("{member.tag}", `<@${user.id}>`)
                                        .replace("{member.id}", user.id)
                                        .replace(
                                            "{member.username}",
                                            user.username
                                        ) as string as string
                                )
                            )
                        ]
                    };
                }

                if (guildRole) {
                    if (member.roles.cache.has(guildRole.id)) {
                        try {
                            await member.roles.remove(guildRole);
                        } catch (error) {
                            if (!client.user)
                                throw new Error("Client user is not defined in cache.");
                            interaction.editReply({
                                content: `## ${await convertToEmojiPng("error", client.user?.id)} OOps! I couldn't remove the role from you.`
                            });
                        }

                        if (removeMessageData) {
                            await (interaction.message as Message).edit({});
                            interaction.editReply({
                                ...removemessage
                            });
                        } else {
                            await (interaction.message as Message).edit({});
                        }
                    } else {
                        try {
                            await member.roles.add(guildRole);
                        } catch (error) {
                            if (!client.user)
                                throw new Error("Client user is not defined in cache.");
                            interaction.editReply({
                                content: `## ${await convertToEmojiPng("error", client.user?.id)} OOps! I couldn't add the role to you.`
                            });
                        }

                        if (addMessageData) {
                            await (interaction.message as Message).edit({});
                            interaction.editReply({
                                ...addmessage
                            });
                        } else {
                            await (interaction.message as Message).edit({});
                        }
                    }
                }
            }
            if (!addMessageData || !removeMessageData) {
                return interaction.deleteReply();
            }
        }
    }
};
