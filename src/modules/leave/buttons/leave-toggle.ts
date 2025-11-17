import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "leave-toggle",

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

        switch (data.LeaveEnabled) {
            case false: {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild?.id,
                            LeaveEnabled: true
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {GuildId: interaction.guild?.id},
                        data: {LeaveEnabled: true}
                    }
                );
                if (!client.user) throw new Error("Client user not found");
                await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleon")} Leave is now enabled`, interaction, true)
            }
                break;
            case true: {
                if (!data) {
                    await database.guildFeatureToggles.create({
                        data: {
                            GuildId: interaction.guild?.id,
                            LeaveEnabled: false
                        }
                    });
                }

                await database.guildFeatureToggles.update(
                    {
                        where: {GuildId: interaction.guild?.id},
                        data: {LeaveEnabled: false}
                    }
                );
                if (!client.user) throw new Error("Client user not found");
                await sendDefaultMessage(`## ${await convertToEmojiToPng("toggleoff")} Leave is now disabled`, interaction, true)
            }

                break;
        }

    }
};
