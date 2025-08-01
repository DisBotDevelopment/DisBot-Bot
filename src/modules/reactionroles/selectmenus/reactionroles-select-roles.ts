import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    MessageFlags,
    TextChannel,
    UserSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-select-roles",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];

        const data = await database.reactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (!client.user) throw new Error("Client user is not cached");
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No data found`,
                flags: MessageFlags.Ephemeral
            });
        }

        const channel = await client.channels.fetch(data.ChannelId as string);
        const message = await (channel as TextChannel).messages.fetch(
            data.MessageId as string
        );

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`reactionroles-type-emoji:${uuid}`)
                .setLabel("Emoji Reaction")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:emoji:1327305922359332935>"),
            new ButtonBuilder()
                .setCustomId(`reactionroles-type-select:${uuid}`)
                .setLabel("Select Menu")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(message.author.id == client.user.id ? false : true)
                .setEmoji("<:selectmenu:1327304700701315132>"),
            new ButtonBuilder()
                .setCustomId(`reactionroles-type-button:${uuid}`)
                .setLabel("Button")
                .setDisabled(message.author.id == client.user.id ? false : true)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:button:1327305176553492520>")
        );

        for (const role of interaction.values) {
            const guildRole = await interaction.guild?.roles.fetch(role);

            if (guildRole?.managed) {
                continue;
            }

            if (
                guildRole?.position &&
                interaction.guild?.members.me?.roles.highest.position &&
                guildRole.position >=
                interaction.guild.members.me.roles.highest.position
            ) {
                if (!client.user) throw new Error("Client user is not cached");
                await interaction.update({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} I can't use ${guildRole} role because it's higher than my highest role.`
                });
            }

            await database.reactionRoles.update(
                {
                    where: {UUID: uuid},
                    data: {
                        Roles: {
                            push: role
                        }
                    }
                }
            );
        }

        if (!client.user) throw new Error("Client user is not cached");
        interaction.update({
            components: [row],
            content: `## ${await convertToEmojiPng("role", client.user?.id)} Selcet the Reaction Type for the Role`
        });
    }
};
