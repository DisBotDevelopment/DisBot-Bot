import {
    GuildTextBasedChannel,
    MessageFlags,
    ModalSubmitInteraction,
    TextBasedChannel,
    TextChannel,
    TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "reactionroles-type-emoji-modal",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];

        const reactData = await database.guildReactionRoles.findFirst({
            include: {
                SelectMenu: true,
                Button: true,
            },
            where: {
                UUID: uuid
            }
        });

        if (
            reactData?.Button?.Type ||
            reactData?.SelectMenu?.Label ||
            reactData.Emoji
        ) {
            if (!client.user) throw new Error("Client user is not cached");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} You have already set a type for this reaction role`,
                components: []
                , flags: MessageFlags.Ephemeral
            });
        }

        const reactChannel = interaction.guild.channels.cache.get(reactData.ChannelId)
        const reactMessage = (reactChannel as TextBasedChannel).messages.cache.get(reactData.MessageId)

        if (reactMessage.reactions.cache.has(interaction.fields.getTextInputValue(
            "reactionroles-types-emoji-emoji"
        ))) return interaction.reply({
            content: `## ${await convertToEmojiToPng("error")} You can't use the same emoji again.`
        })

        await database.guildReactionRoles.update(
            {
                where: {UUID: uuid},
                data: {
                    Emoji: interaction.fields.getTextInputValue(
                        "reactionroles-types-emoji-emoji"
                    )
                }
            }
        );

        const data = await database.guildReactionRoles.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (!client.user) throw new Error("Client user is not cached");
        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("error")} No data found`,
                flags: MessageFlags.Ephemeral
            });
        }

        const channel = await interaction.guild?.channels.fetch(
            data.ChannelId as string
        );
        const message = await (channel as TextChannel)?.messages.fetch(
            data.MessageId as string
        );

        await message.react(data?.Emoji as string);

        await interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Reaction Role created successfully with type: Emoji`,
            flags: MessageFlags.Ephemeral
        });
    }
};
