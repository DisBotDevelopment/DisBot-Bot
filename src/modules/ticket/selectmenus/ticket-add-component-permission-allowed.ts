import {ChannelType, Client, PermissionsBitField, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "ticket-add-component-permission-allowed",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const permissions: PermissionsBitField = new PermissionsBitField();

        for (const value of interaction.values) {
            permissions.add(BigInt(value))
        }

        await database.ticketPermissions.update(
            {
                where: {
                    UUID: uuid
                },
                data: {
                    AllowedDiscordPermissions: permissions.bitfield
                }
            }
        )

        await interaction.deferUpdate();
    }
};
