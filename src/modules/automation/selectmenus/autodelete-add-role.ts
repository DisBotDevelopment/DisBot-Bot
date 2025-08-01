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
    id: "autodelete-add-role",

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

            if (data.WhitelistedRoles.includes(value)) {
                await database.autoDeletes.updateMany(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            WhitelistedRoles: {
                                set: data.WhitelistedRoles.filter((r: string) => r != value)
                            }
                        }
                    }
                );

                await interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} Role removed successfully! (${data.WhitelistedRoles.length - 1})`,
                    flags: MessageFlags.Ephemeral
                });
                continue;
            } else {

                const newRoles = [...data.WhitelistedRoles, value];
                await database.autoDeletes.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            WhitelistedRoles: {
                                push: newRoles
                            }
                        }
                    }
                )
            }

            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Role added successfully! (${data.WhitelistedRoles.length + 1})`,
                flags: MessageFlags.Ephemeral
            });

        }
    }
};
