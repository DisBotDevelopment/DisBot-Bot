import "dotenv/config";
import {MessageFlags, StringSelectMenuInteraction,} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autopublish-add",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });
        for (const value of interaction.values) {


            const data = await database.autoPublish.findFirst({
                where: {
                    GuildId: interaction.guildId
                }
            });

            if (!data) {
                await database.autoPublish.create({
                    data: {
                        GuildId: interaction.guild?.id,
                        Channels: [value],
                    }
                });
            }

            await database.autoPublish.update(
                {
                    where: {
                        GuildId: interaction.guild?.id,
                    }
                    , data: {
                        Channels: {
                            push: value
                        }
                    }
                })
        }

        if (!client.user) throw new Error("Client user is not cached.");
        await interaction.editReply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Channel(s) added to autopublish successfully (${interaction.values.length} channels)`,
        });

    },
};
