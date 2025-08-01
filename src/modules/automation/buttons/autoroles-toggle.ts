import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autoroles-toggle",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not cached.");

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild?.id,
            }
        });

        if (!toggleData) {
            await database.guildFeatureToggles.create({
                data: {
                    GuildId: interaction.guild?.id,
                    AutorolesEnabled: true,
                }
            });
        } else {
            if (toggleData.AutorolesEnabled) {
                await database.guildFeatureToggles.update({
                    where: {
                        GuildId: interaction.guildId
                    },
                    data: {
                        AutorolesEnabled: false
                    }
                })
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} Autoroles successfully disabled`,
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await database.guildFeatureToggles.update({
                    where: {
                        GuildId: interaction.guildId
                    },
                    data: {
                        AutorolesEnabled: true
                    }
                })
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} Autoroles successfully enabled`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    }
};
