import "dotenv/config";
import {Emoji, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "autoreact-add-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const emoji = interaction.fields.getTextInputValue("emoji");
        const channel = interaction.fields.getTextInputValue("channel");
        const guild = interaction.guild;

        if (!guild) {
            if (!client.user) throw new Error("Client user is not cached.");
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("cross")} Guild not found`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }


        const data = await database.guildAutoReacts.findFirst({
            where: {
                GuildId: guild.id,
                Emoji: emoji,
                ChannelId: channel
            }
        });


        if (data) {
            if (!client.user) throw new Error("Client user is not cached.");
            return interaction.reply({
                content: `## ${await convertToEmojiToPng("cross")} Autoreact already exists for <#${channel}> with the emoji ${emoji}`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.guildAutoReacts.create({
            data: {
                GuildId: guild.id,
                ChannelId: channel,
                Emoji: emoji,
            }
        });

        if (!client.user) throw new Error("Client user is not cached.");
        await interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Autoreact successfully added to <#${channel}> with the emoji ${emoji}`,
            flags: MessageFlags.Ephemeral
        });
    },
};