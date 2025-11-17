import {ChannelType, Client, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-required-roles",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        for (const value of interaction.values) {
            const role = interaction.guild.roles.cache.get(value);
            if (role.managed) {
                return await interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")} You can't select a managed role.`,
                    flags: MessageFlags.Ephemeral,
                })
            }
        }

        await database.ticketSetups.update(
            {
                where: {
                    CustomId: interaction.customId.split(":")[1]
                },
                data: {
                    RequiredRoles: {
                        set: interaction.values
                    },
                }
            }
        );

        await interaction.deferUpdate();
    }
};
