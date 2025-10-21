import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
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
                UUID: interaction.customId.split(":")[1]
            }
        })
        for (const value of interaction.values) {
            if (!client.user) throw new Error("User not found");

            if (!data) {
                await interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")}  No vanity data found for this UUID.`,
                    flags: MessageFlags.Ephemeral
                })
            }

            const channel = interaction.guild?.channels.cache.get(value);
            if (!channel) {
                await interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")}  Channel not found.`,
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            if (!data?.Analytics?.TrackMessageId) return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")}  No tracking message ID found. Please set up the message Id for the channel first.`,
                flags: MessageFlags.Ephemeral
            });

            await database.vanityAnalytic.update(
                {
                    where: {
                        VanityId: interaction.customId
                    },
                    data: {
                        TrackInviteWithLog: channel.id,
                    }
                })

            await interaction.reply({
                content: `## ${await convertToEmojiToPng("check")}  Invite logging channel set to <#${channel.id}>.`,
                flags: MessageFlags.Ephemeral
            })
        }
    }
}