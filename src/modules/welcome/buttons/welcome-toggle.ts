import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "welcome-toggle",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        
        const data = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        });

        switch (data.WecomeEnabled) {
            case false: {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild?.id,
                            WecomeEnabled: true
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {GuildId: interaction.guild?.id},
                        data: {WecomeEnabled: true}
                    }
                );
                if (!client.user) throw new Error("Client user not found");
                await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleon")} Welcome is now enabled`, interaction, true)
            }
                break;
            case true: {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild?.id,
                            WecomeEnabled: false
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {GuildId: interaction.guild?.id},
                        data: {WecomeEnabled: false}
                    }
                );
                if (!client.user) throw new Error("Client user not found");
                await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleoff")} Welcome is now disabled`, interaction, true)
            }

                break;
        }

    }
};
