import {ButtonInteraction, MessageFlags} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    id: "autoreact-toggle",

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
                    AutoreactEnabled: true,
                }
            });
        } else {
            if (toggleData.AutoreactEnabled) {
                await database.guildFeatureToggles.update({
                    where: {
                        GuildId: interaction.guildId
                    },
                    data: {
                        AutoreactEnabled: false
                    }
                })
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} Autoreact successfully disabled`,
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await database.guildFeatureToggles.update({
                    where: {
                        GuildId: interaction.guildId
                    },
                    data: {
                        AutoreactEnabled: true
                    }
                })
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} Autoreact successfully enabled`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    }
};
