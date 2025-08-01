import "dotenv/config";
import {MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "autoreact-add-modal",

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const emoji = interaction.fields.getTextInputValue("emoji");
        const channel = interaction.fields.getTextInputValue("channel");
        const guild = interaction.guild;

        if (!guild) {
            if (!client.user) throw new Error("Client user is not cached.");
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("cross", client.user?.id)} Guild not found`,
                flags: MessageFlags.Ephemeral
            });
            ;
        }
        const data = await database.autoReacts.findFirst({
            where: {
                GuildId: guild.id,
                ChannelId: channel,
                Emoji: emoji,
            }
        });
        if (data) {
            if (!client.user) throw new Error("Client user is not cached.");
            return await interaction.reply({
                content: `## ${await convertToEmojiPng("cross", client.user?.id)} Autoreact already exists for <#${channel}> with the emoji ${emoji}`,
                flags: MessageFlags.Ephemeral
            });
        }

        await database.autoReacts.create({
            data: {
                GuildId: guild.id,
                ChannelId: channel,
                Emoji: emoji,
            }
        });

        if (!client.user) throw new Error("Client user is not cached.");
        await interaction.reply({
            content: `## ${await convertToEmojiPng("check", client.user?.id)} Autoreact successfully added to <#${channel}> with the emoji ${emoji}`,
            flags: MessageFlags.Ephemeral
        });
    },
};
