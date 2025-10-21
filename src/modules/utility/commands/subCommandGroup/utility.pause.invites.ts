import {ChannelType, ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiToPng} from "../../../../helper/emojis.js";
import {database} from "../../../../main/database.js";

export default {
    subCommandGroup: "utility.pause.invites",

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        if (!client.user) throw new Error("User is not logged in.");

        await interaction.deferReply(
            {
                flags: MessageFlags.Ephemeral
            }
        )

        const data = await database.discordGuildAddon.findFirst({
            where: {
                GuildId: interaction.guild?.id
            }
        })
        if (!data) {
            await database.discordGuildAddon.create({
                data: {
                    GuildId: interaction.guild?.id,
                    InvitesPaused: false
                }
            })
        }


        const isDisabled = await database.discordGuildAddon.findFirst({
            where: {
                GuildId: interaction.guild?.id,
                InvitesPaused: true
            }
        })

        if (isDisabled) {
            await interaction.guild?.disableInvites(false)
            await database.discordGuildAddon.update({
                where: {
                    GuildId: interaction.guild?.id,
                },
                data: {
                    InvitesPaused: false
                }
            })
            return interaction.editReply({
                content: `## ${await convertToEmojiToPng("check")} You set Invites to enabled for unlimited time!`
            })
        } else {
            await interaction.guild?.disableInvites(true)
            await database.discordGuildAddon.update({
                where: {
                    GuildId: interaction.guild?.id
                },
                data: {
                    InvitesPaused: true
                }
            })
            return interaction.editReply({
                content: `## ${await convertToEmojiToPng("check")} You set Invites to disabled for unlimited time!`
            })
        }
    }
};
