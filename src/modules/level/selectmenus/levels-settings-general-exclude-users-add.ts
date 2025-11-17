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
    id: "levels-settings-general-exclude-users-add",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const users = interaction.values

        for (const user of users) {
            await database.levelSettings.update({
                where: {
                    GuildId: interaction.guild.id
                },
                data: {
                    ExcludeUserIds: {
                        push: user
                    }
                }
            })
        }

        await interaction.deferUpdate()
    },
};
