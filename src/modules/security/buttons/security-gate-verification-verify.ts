import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    GuildMember,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {VerificationAction, VerificationActionType} from "../../../enums/verification.js";
import {generateCaptcha, verifyAction} from "../../../systems/verifictionAction.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";

export default {
    id: "security-gate-verification-verify",

    /**
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        if (!client.user) throw new Error("Client user is not defined.");
        const uuid = interaction.customId.split(":")[1];
        const data = await database.verificationGates.findFirst({
            where: {
                UUID: uuid
            }
        });

        if (data?.Active === false) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} This security gate is not active.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (!data) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} This security gate does not exist.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const type = data.ActionType;
        switch (type) {
            case VerificationActionType.MathTask: {

                const numer1 = Math.floor(Math.random() * 100) + 1;
                const numer2 = Math.floor(Math.random() * 100) + 1;
                const result = numer1 + numer2;


                const modal = new ModalBuilder()
                    .setCustomId(`security-gate-verification-math:${uuid}:${result}`)
                    .setTitle("Security Gate Verification - Math Task");

                const input = new TextInputBuilder()
                    .setCustomId("security-gate-verification-math-input")
                    .setLabel("What is the result of the following task?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setPlaceholder(`${numer1} + ${numer2} = ?`);

                const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
                modal.addComponents(row);
                interaction.showModal(modal);
            }
                break;
            case VerificationActionType.Reaction: {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} This security gate type is not supported.`,
                    flags: MessageFlags.Ephemeral
                });
            }
                break;
            case VerificationActionType.Button: {
                const verify = await verifyAction(interaction.member as GuildMember, data.Action as VerificationAction, uuid);

                if (verify == false) {
                    return interaction.reply({
                        content: `## ${await convertToEmojiPng("check", client.user?.id)} You unverified yourself! and removed all permissions and roles.`,
                        flags: MessageFlags.Ephemeral
                    });
                }

                interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} You have successfully verified yourself!`,
                    flags: MessageFlags.Ephemeral
                });
            }
                break;
            case VerificationActionType.Authorize: {
                interaction.reply({
                    content: `## ${await convertToEmojiPng("check", client.user?.id)} OoO... This security gate is not supported yet. The Button setup is not a Link!`,
                    flags: MessageFlags.Ephemeral
                });
            }
                break;
            case VerificationActionType.Code: {

                const code = randomUUID().split("-")[0].toUpperCase();

                const modal = new ModalBuilder()
                    .setCustomId(`security-gate-verification-code:${uuid}:${code}`)
                    .setTitle("Security Gate Verification - Code: " + code);
                const input = new TextInputBuilder()
                    .setCustomId("security-gate-verification-code-input")
                    .setLabel("Please enter the code:")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setPlaceholder("Enter the code here");
                const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
                modal.addComponents(row);
                interaction.showModal(modal);

            }
                break;
            case VerificationActionType.Captcha: {

                const {code, imageBuffer} = generateCaptcha();

                const attachment = new AttachmentBuilder(imageBuffer, {name: "captcha.png"});
                await interaction.reply({
                    content: `## ${await convertToEmojiPng("bot", client.user?.id)} Please solve the captcha to verify yourself.`,
                    files: [attachment],
                    flags: MessageFlags.Ephemeral,
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`security-gate-verification-captcha:${uuid}:${code}`)
                                .setEmoji("<:shieldcheck:1380558415968862218>")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                });

            }
                break;
            default: {
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} This security gate type is not supported.`,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};


