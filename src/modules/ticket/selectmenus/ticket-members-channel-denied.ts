import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Client,
    ContainerBuilder, GuildMember,
    MessageFlags, PermissionFlagsBits, PermissionsBitField,
    PrivateThreadChannel,
    RoleSelectMenuBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize, StringSelectMenuBuilder,
    TextChannel,
    TextDisplayBuilder,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {hasTicketPermission, ticketErrorMessage} from "../../../helper/ticketHelper.js";

export default {
    id: "ticket-members-channel-denied",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {

        const memberId = interaction.customId.split(":")[1]

        const permissions: PermissionsBitField = new PermissionsBitField();
        const permissionList: Record<string, boolean> = {};

        for (const value of interaction.values) {
            permissions.add(BigInt(value))
        }

        const denyList = new PermissionsBitField(permissions).toArray();
        for (const d of denyList) {
            permissionList[d] = false;
        }

        await (interaction.channel as TextChannel).permissionOverwrites.create(memberId, permissionList);
        await interaction.update({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`Added permissions (${denyList}) to member <@${memberId}>`))
            ]
        })
    }
}
