import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    GuildMemberRoleManager,
    MessageFlags, RoleSelectMenuInteraction,
    UserSelectMenuInteraction,
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    id: "levels-settings-streaks-add-reward-roles",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: RoleSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const roles = interaction.values

        await database.xPStreaks.updateMany({
            where: {
                Days: Number(interaction.customId.split(":")[1]),
                GuildId: interaction.guild.id,
            },
            data: {
                RoleRewardIds: {
                    set: roles
                }
            }
        })

        await interaction.deferUpdate()
    },
};
