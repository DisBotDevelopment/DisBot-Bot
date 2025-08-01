import "dotenv/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ClientUser,
    EmbedBuilder,
    MessageFlags,
    RoleSelectMenuBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    id: "autodelete-add-channel",

    async execute(
        interaction: StringSelectMenuInteraction,
        client: ExtendedClient
    ) {
        for (const value of interaction.values) {

            const uuid = interaction.customId.split(":")[1];

            const data = await database.autoDeletes.findFirst({
                where: {
                    UUID: uuid
                }
            });


            if (!client.user) throw new Error("Client user is not defined");
            if (!data) {
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} No AutoDelete setup found with UUID: \`${uuid}\``,
                    flags: MessageFlags.Ephemeral
                });
                continue;
            }

            if (data?.ChannelId == value) {
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} This channel is already set for AutoDelete setup with UUID: \`${uuid}\``,
                    flags: MessageFlags.Ephemeral
                });
                continue;
            }

            await database.autoDeletes.update(
                {
                    where: {
                        UUID: uuid
                    },
                    data: {
                        ChannelId: value
                    }
                },
            )

            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Channel has been set for AutoDelete setup with UUID: \`${uuid}\``,
                flags: MessageFlags.Ephemeral
            });

        }
    }
};
