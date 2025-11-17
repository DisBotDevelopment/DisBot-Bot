import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    GuildMemberRoleManager,
    MessageFlags,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "levels-settings-general-exclude-users-remove",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const data = await database.levelSettings.findFirst({
            where: {
                GuildId: interaction.guild.id
            }
        })

        const filter = data.ExcludeUserIds.filter((i) => i != interaction.values[0])

        await database.levelSettings.update({
            where: {
                GuildId: interaction.guild.id
            },
            data: {
                ExcludeUserIds: {
                    set: filter
                }
            }
        })

        await interaction.deferUpdate()
    },
};
