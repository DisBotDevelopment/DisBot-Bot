import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction,} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "autopublish-remove",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });
        for (const value of interaction.values) {

            const data = await database.guildAutoPublish.findFirst({
                where: {
                    GuildId: interaction.guild?.id,
                }
            });

            if (!data) {
                if (!client.user) throw new Error("Client user is not cached.");
                await interaction.editReply({
                    content: `## ${await convertToEmojiToPng("error")} No autopublish data found`,
                });
                continue;

            }

            await database.guildAutoPublish.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                    },
                    data: {
                        Channels: {
                            set: data.Channels.filter((c) => c != value)
                        }
                    }
                },
            );
        }

        if (!client.user) throw new Error("Client user is not cached.");
        await interaction.editReply({
            content: `## ${await convertToEmojiToPng("check")} Channel(s) removed from autopublish successfully (${interaction.values.length} channels)`,
        });

    },
};
