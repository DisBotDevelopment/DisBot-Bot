import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "bot-notify-updates",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client not ready");

        const data = await database.disBotUserNotifications.findFirst({
            where: {
                UserId: interaction.user.id
            }
        });

        if (!data) {
            await database.disBotUserNotifications.create({
                data: {
                    UserId: interaction.user.id,
                    Announcements: false,
                    Updates: true,
                    Status: false,
                    Customer: false,
                }
            })

            return interaction.reply({
                content: `## ${await convertToEmojiPng("toggleon", client.user.id)} You have toggled on updates notifications!`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (data) {
            if (data.Updates == true) {
                await database.disBotUserNotifications.update({
                        where: {
                            UserId: interaction.user.id
                        },
                        data: {
                            Updates: false
                        }
                    }
                );
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("toggleoff", client.user.id)} You have toggled off updates notifications!`,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await database.disBotUserNotifications.update({
                        where: {
                            UserId: interaction.user.id
                        },
                        data: {
                            Updates: true
                        }
                    }
                );
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("toggleon", client.user.id)} You have toggled on updates notifications!`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};
