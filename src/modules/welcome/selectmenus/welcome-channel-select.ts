import {
    ActionRowBuilder,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuInteraction,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "welcome-channel-select",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ChannelSelectMenuInteraction, client: ExtendedClient) {

        const channel = await interaction.guild.channels.fetch(interaction.values[0]);

        const data = await database.guildWelcomeSetup.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        })

        if (!data) {
            await database.guildWelcomeSetup.create({
                data: {
                    Image: false,
                    ChannelId: channel.id,
                    Guilds: {
                        connect: {
                            GuildId: interaction.guild.id
                        },
                    }
                }
            })
        }

        await database.guildWelcomeSetup.update({
            where: {
                GuildId: interaction.guild.id
            },
            data: {
                ChannelId: channel.id
            }
        })

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Set Channel ${channel} for your welcome module.`, interaction, true)
    }
};
