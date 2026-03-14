import {
    ChannelSelectMenuInteraction,
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
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

        const channel = await interaction.guild?.channels.fetch(interaction.values[0] ?? "");

        if (!interaction.guildId && !channel) return

        const data = await database.guildWelcomeSetup.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        })

        if (!data) {
            await database.guildWelcomeSetup.create({
                data: {
                    Image: false,
                    ChannelId: channel.id,
                    Guilds: {
                        connect: {
                            GuildId: interaction.guildId
                        },
                    }
                }
            })
        }

        await database.guildWelcomeSetup.update({
            where: {
                GuildId: interaction.guildId
            },
            data: {
                ChannelId: channel.id
            }
        })

        await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Set Channel ${channel} for your welcome module.`, interaction, true)
    }
};
