import {ExtendedClient} from "../../../types/client.js"
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    ContainerBuilder, GuildBasedChannel, Message,
    MessageFlags,
    ModalSubmitInteraction,
    StringSelectMenuBuilder, TextChannel, TextDisplayBuilder,
} from "discord.js";
import pkg from "short-uuid";
import {database} from "../../../main/database.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

const {uuid} = pkg;

export default {
    id: "security-gate-verification-create-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("User is not logged in.");
        const messageURL = interaction.fields.getTextInputValue("security-gate-verification-create-message-url");

        let channel: GuildBasedChannel
        let message: Message
        if (messageURL) {
            channel = await interaction.guild?.channels.fetch(messageURL.split("/")[5])
            if (!channel || !channel.isTextBased()) {
                await interaction.reply({
                    content: `## ${await convertToEmojiToPng("error")} Invalid Channel`,
                    flags: MessageFlags.Ephemeral
                });
                return;
            }
            message = await channel?.messages.fetch(messageURL.split("/")[6]);

            const data = await database.verificationGates.findFirst({
                where: {
                    MessageId: message.id
                }
            })

            if (data) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This message is already used for verification.`, interaction, true, "reply")
            }


        }

        const UUID = uuid();

        await database.verificationGates.create
        ({
            data: {
                UUID: UUID,
                MessageId: message ? message.id : "componentsv2",
                ChannelId: channel ? channel.id : "componentsv2",
                CreatedAt: new Date,
                SecurityId: interaction.guildId
            }
        });

        await interaction.reply(
            {
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                components: [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`## ${await convertToEmojiToPng("check")} Verification Gate created successfully!`)
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId("security-gate-verification-select")
                                    .setPlaceholder("Select Verification Gate")
                                    .addOptions(
                                        {
                                            label: "Math Verification",
                                            value: "math_task:" + UUID,
                                            description: "Verify users with a math question",
                                            emoji: "<:calculator:1377366667805589524>",
                                        },
                                        {
                                            label: "Reaction Verification",
                                            value: "reaction:" + UUID,
                                            description: "Verify users with a reaction",
                                            emoji: "<:emoji:1327305922359332935>",
                                        },
                                        {
                                            label: "Button Verification",
                                            value: "button:" + UUID,
                                            description: "Verify users with a button click",
                                            emoji: "<:click:1377367242525905069>",
                                        },
                                        {
                                            label: "Authorize Verification",
                                            value: "authorize:" + UUID,
                                            description: "Verify users with an authorization",
                                            emoji: "<:authorize:1377367876788551792>",
                                        },
                                        {
                                            label: "Code Verification",
                                            value: "code:" + UUID,
                                            description: "Verify users with a code",
                                            emoji: "<:binary:1377367878470467604>",
                                        },
                                        {
                                            label: "Captcha Verification",
                                            value: "captcha:" + UUID,
                                            description: "Verify users with a captcha",
                                            emoji: "<:captcha:1377367875353841805>",
                                        },
                                    )
                            )
                        )
                ]

            }
        )


    }
};
