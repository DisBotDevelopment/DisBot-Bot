import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "vanity-toggle-invite-logging-select",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const data = await database.vanitys.findFirst
        ({
            include: {
                Analytics: true
            },
            where: {
                UUID: interaction.customId
            }
        })
        for (const value of interaction.values) {
            if (!client.user) throw new Error("User not found");

            if (!data) {
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)}  No vanity data found for this UUID.`,
                })
            }

            const channel = interaction.guild?.channels.cache.get(value);
            if (!channel) {
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user.id)}  Channel not found.`,
                });
                return;
            }

            if (!data?.Analytics?.TrackMessageId) return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user.id)}  No tracking message ID found. Please set up the message Id for the channel first.`,
                flags: MessageFlags.Ephemeral
            });

            await database.vanityAnalytics.update(
                {
                    where: {
                        VanityId: interaction.customId
                    },
                    data: {
                        TrackInviteWithLog: channel.id,
                    }
                })

            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user.id)}  Invite logging channel set to <#${channel.id}>.`,
                flags: MessageFlags.Ephemeral
            })
        }
    }
}