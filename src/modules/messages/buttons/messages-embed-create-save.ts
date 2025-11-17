import {ButtonStyle, ChannelType, MessageFlags, UserSelectMenuInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "messages-embed-create-save",

    /**
     * @param {UserSelectMenuInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: UserSelectMenuInteraction,
        client: ExtendedClient
    ) {
        const uuid = interaction.customId.split(":")[1];
        const isExtra = interaction.customId.split(":")[3] ?? "";
        const isExtraEdit = interaction.customId.split(":")[4] ?? "";
        const isExtraEditId = interaction.customId.split(":")[5] ?? "";
        const message = await interaction.channel?.messages.fetch(interaction.customId.split(":")[2]);
        if (!message) {
            return interaction.reply({
                content: "Message not found.",
                flags: MessageFlags.Ephemeral
            });
        }

        if (isExtraEdit == "isExtraEdit") {
            const data = await database.messageTemplates.findFirst({
                where: {
                    Name: uuid
                }
            })

            const embed = data.OtherEmbeds.filter((e, i) => i != Number(isExtraEditId))

            const updatedEmbeds = [
                ...embed,
                JSON.stringify(message?.embeds[0].data)
            ];

            await database.messageTemplates.update({
                where: {
                    Name: uuid
                },
                data: {
                    OtherEmbeds: {
                        set: updatedEmbeds,
                    }
                }
            })

            return await interaction
                .reply({
                    content: `## ${await convertToEmojiToPng(
                        "check"
                    )} Added new Embed and removed the old!`,
                    flags: MessageFlags.Ephemeral
                })
                .then(async () => {
                    setTimeout(async () => {
                        return await interaction.deleteReply();
                    }, 5000);
                });


        }

        if (isExtra == "isExtra") {
            const data = await database.messageTemplates.findFirst({
                where: {
                    Name: uuid
                }
            })

            if (isExtra && data.OtherEmbeds.length >= 9) {
                return interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")} You only can have 9 Embeds & your Main-Embed!`,
                    flags: MessageFlags.Ephemeral,
                })
            }

            const updatedEmbeds = [
                JSON.stringify(message?.embeds[0].data)
            ];


            if (data?.OtherEmbeds) updatedEmbeds.push(...data.OtherEmbeds)


            await database.messageTemplates.update(
                {
                    where: {
                        Name: uuid
                    },
                    data: {
                        OtherEmbeds: updatedEmbeds
                    }
                }
            );

            return await interaction
                .reply({
                    content: `## ${await convertToEmojiToPng(
                        "check"
                    )} You added this embed to \`${uuid}\` as extra Embed!`,
                    flags: MessageFlags.Ephemeral
                })
                .then(async () => {
                    setTimeout(async () => {
                        return await interaction.deleteReply();
                    }, 5000);
                });
        }


        await database.messageTemplates.update(
            {
                where: {
                    Name: uuid
                },
                data: {
                    EmbedJSON: JSON.stringify(message?.embeds[0].data)
                }
            }
        );

        if (!client.user) throw new Error("Client not found!");
        await interaction
            .reply({
                content: `## ${await convertToEmojiToPng(
                    "check"
                )} The embed has been saved.\n-# You also can edit but note that you need to save it again.`,
                flags: MessageFlags.Ephemeral
            })
            .then(async () => {
                setTimeout(async () => {
                    await interaction.deleteReply();
                }, 5000);
            });
    }
};
