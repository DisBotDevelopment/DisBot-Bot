import "dotenv/config";
import {MessageFlags, ModalSubmitInteraction,} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "autoreact-remove-modal",

    async execute(
        interaction: ModalSubmitInteraction,
        client: ExtendedClient
    ) {
        const emoji = interaction.fields.getTextInputValue("emoji");
        const channel = interaction.fields.getTextInputValue("channel");
        const guild = interaction.guild;

        const data = await database.guildAutoReacts.findFirst({
            where: {
                GuildId: guild?.id,
                ChannelId: channel,
                Emoji: emoji,
            }
        });
        if (!data) {
            if (!client.user) throw new Error("Client user is not cached.");
            await interaction.reply({
                content: `## ${await convertToEmojiToPng("cross")} Autoreact not found for <#${channel}> with the emoji ${emoji}`,
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        await database.guildAutoReacts.delete({
            where: {
                Id: data.Id,
                GuildId: guild?.id,
                ChannelId: channel,
                Emoji: emoji,
            }
        });

        if (!client.user) throw new Error("Client user is not cached.");
        await interaction.reply({
            content: `## ${await convertToEmojiToPng("check")} Autoreact successfully removed from <#${channel}> with the emoji ${emoji}`,
            flags: MessageFlags.Ephemeral
        });
    },
};
