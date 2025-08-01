import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import * as trace_events from "node:trace_events";


export default {
    id: "bot-notify-announcments",

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
                    Announcements: true,
                    Updates: false,
                    Status: false,
                    Customer: false,
                }
            })

            return interaction.reply({
                content: `## ${await convertToEmojiPng("toggleon", client.user.id)} You have toggled on announcments notifications!`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (data) {
            if (data.Announcements == true) {
                await database.disBotUserNotifications.update(
                    {
                        where: {
                            UserId: interaction.user.id
                        },
                        data: {
                            Announcements: false
                        }
                    },
                );
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("toggleoff", client.user.id)} You have toggled off announcments notifications!`,
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await database.disBotUserNotifications.update(
                    {
                        where: {
                            UserId: interaction.user.id
                        },
                        data: {
                            Announcements: true
                        }
                    },
                );
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("toggleon", client.user.id)} You have toggled on announcments notifications!`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }


    }
};
