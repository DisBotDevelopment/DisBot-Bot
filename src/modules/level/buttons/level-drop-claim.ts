import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import ms, {StringValue} from "ms";
import {calcXP} from "../../../systems/level/levelMath.js";

export default {
    id: "level-drop-claim",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1]
        const data = await database.xPDrops.findFirst({
                include: {
                    LevelSettings: true
                },
                where: {
                    UUID: uuid
                }
            }
        )

        const spawnedAt = new Date(data.LastSpawned).getTime();
        const expireTime = ms(data.ExpireTime as StringValue);
        const expireTimestamp = spawnedAt + expireTime;

        if (Date.now() > expireTimestamp) {
            await interaction.message.delete()
            if (interaction.customId.split(":")[2]) {
                const msgId = interaction.customId.split(":")[2]
                const message = await interaction.channel.messages.fetch(msgId)
                await message.delete()
            }
            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`-# Drop is expired...`)
                        )
                ]
            }).then((i) => setTimeout(() => {
                i.delete()
            }, 1000))
            return
        }

        const claimed = await database.levels.findMany({
            where: {
                ClaimedXPDrops: {
                    has: data.UUID
                }
            }
        })

        if (claimed.length >= data.ClaimAmount) {
            await interaction.message.delete()
            if (interaction.customId.split(":")[2]) {
                const msgId = interaction.customId.split(":")[2]
                const message = await interaction.channel.messages.fetch(msgId)
                await message.delete()
            }
            await interaction.reply({
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`-# Drop has been claimed too many times...`)
                        )
                ]
            })
            return
        }

        const xpRange = calcXP(parseInt(data.XPRange.split("-")[0]), parseInt(data.XPRange.split("-")[1]))
        const userData = await database.levels.findFirst({
            where: {
                UserId: interaction.user.id,
                GuildId: interaction.guild.id,
            }
        })
        if (!userData) {
            return await sendDefaultMessage(`-# No Account found...`, interaction, true, "reply")
        }

        if (userData.ClaimedXPDrops.includes(data.UUID)) {
            return await sendDefaultMessage(`-# You already claimed this drop...`, interaction, true, "reply")
        }

        await database.levels.update({
            where: {
                UserId: interaction.user.id,
                GuildId: interaction.guild.id,
                UUID: userData.UUID
            },
            data: {
                ClaimedXPDrops: {
                    push: data.UUID
                },
                XP: userData.XP + xpRange
            }
        })
        return await sendDefaultMessage(`-# Claimed XP Drop successfully!`, interaction, true, "reply")
    }
};
