import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "bot-notify-customer",

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
                    Updates: false,
                    Status: false,
                    Customer: true,
                }
            })

            return interaction.reply({
                content: `## ${await convertToEmojiPng("toggleon", client.user.id)} You have toggled on customer notifications!`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (data) {
            if (data.Customer == true) {
                await database.disBotUserNotifications.update({
                        where: {
                            UserId: interaction.user.id
                        },
                        data: {
                            Customer: false
                        }
                    }
                );
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("toggleoff", client.user.id)} You have toggled off customer notifications!`,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await database.disBotUserNotifications.update({
                        where: {
                            UserId: interaction.user.id
                        },
                        data: {
                            Customer: true
                        }
                    }
                );
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("toggleon", client.user.id)} You have toggled on customer notifications!`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};
