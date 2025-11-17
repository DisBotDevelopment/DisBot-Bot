import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle, ContainerBuilder,
    EmbedBuilder,
    GuildMember, MediaGalleryBuilder, MediaGalleryItemBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {VerificationAction, VerificationActionType} from "../../../enums/verification.js";
import {generateCaptcha, verifyAction} from "../../../systems/verifictionAction.js";
import {randomUUID} from "crypto";
import {database} from "../../../main/database.js";
import {sendDefaultMessage, uploadToCDN} from "../../../helper/utilityHelper.js";

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
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This security gate is not active.`, interaction, true, "reply")
        }

        if (!data) return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} Verification Gate not found`, interaction, true, "reply")

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
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This security gate type is not supported.`, interaction, true, "reply")
            }
                break;
            case VerificationActionType.Button: {
                const verify = await verifyAction(interaction.member as GuildMember, data.Action as VerificationAction, uuid);

                if (verify == false) {
                    return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} You unverified yourself! and removed all permissions and roles.`, interaction, true, "reply")
                }

                return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} You have successfully verified yourself!`, interaction, true, "reply")
            }
                break;
            case VerificationActionType.Authorize: {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} OoO... This security gate is not supported yet. The Button setup is not a Link!`, interaction, true, "reply")
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

                const attachment = await uploadToCDN(imageBuffer)

                await interaction.reply({
                    files: [attachment],
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`## ${await convertToEmojiToPng("bot")} Please solve the captcha to verify yourself.`,)
                            )
                            .addActionRowComponents(new ActionRowBuilder<ButtonBuilder>().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`security-gate-verification-captcha:${uuid}:${code}`)
                                    .setEmoji("<:shieldcheck:1380558415968862218>")
                                    .setStyle(ButtonStyle.Secondary)
                            ))
                            .addMediaGalleryComponents(
                                new MediaGalleryBuilder()
                                    .addItems(
                                        new MediaGalleryItemBuilder()
                                            .setURL(attachment)
                                    )
                            )
                    ]
                });

            }
                break;
            default: {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} This security gate type is not supported.`, interaction, true, "reply")
            }
        }
    }
};


