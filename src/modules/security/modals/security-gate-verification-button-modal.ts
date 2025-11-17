import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType, ContainerBuilder,
    GuildChannel,
    MessageFlags,
    ModalSubmitInteraction,
    TextBasedChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {VerificationActionType} from "../../../enums/verification.js";
import {database} from "../../../main/database.js";
import {Config} from "../../../main/config.js";
import {sendDefaultMessage} from "../../../helper/utilityHelper.js";

export default {
    id: "security-gate-verification-button-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        if (!client.user) throw new Error("Client user is not defined.");

        const data = await database.verificationGates.findFirst({
            where: {
                UUID: interaction.customId.split(":")[1]
            }
        });

        if (!data?.Action && !data?.ChannelId && !data?.MessageId && !data?.ActionType) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} No security gate verification action found for this button.`, interaction, true, "reply")
        }


        const label = interaction.fields.getTextInputValue("security-gate-verification-button-label");
        const emoji = interaction.fields.getTextInputValue("security-gate-verification-button-emoji");
        const style = interaction.fields.getTextInputValue("security-gate-verification-button-style");

        if (!client.user) throw new Error("Client user is not defined.");
        if (!label) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} You must provide a label for the button.`, interaction, true, "reply")
        }

        if (!style || !["PRIMARY", "SECONDARY", "SUCCESS", "DANGER", "LINK"].includes(style.toUpperCase())) {
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} You must provide a valid style for the button. Valid styles are: PRIMARY, SECONDARY, SUCCESS, DANGER, LINK.`, interaction, true, "reply")
        }

        let styleNumber: ButtonStyle = ButtonStyle.Secondary;
        try {
            if (style.toUpperCase() === "LINK") {
                styleNumber = ButtonStyle.Secondary;
            } else if (style.toUpperCase() === "PRIMARY") {
                styleNumber = ButtonStyle.Primary;
            } else if (style.toUpperCase() === "SECONDARY") {
                styleNumber = ButtonStyle.Secondary;
            } else if (style.toUpperCase() === "SUCCESS") {
                styleNumber = ButtonStyle.Success;
            } else if (style.toUpperCase() === "DANGER") {
                styleNumber = ButtonStyle.Danger;
            }

            if (data.ActionType == VerificationActionType.Authorize) styleNumber = ButtonStyle.Link;

            const channel = (interaction.guild?.channels.cache.get(data?.ChannelId as string) as TextBasedChannel | GuildChannel);
            const message = channel.isTextBased() ? await channel.messages.fetch(data?.MessageId as string) : null;

            if (!message) {
                return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} The message for the security gate verification button was not found.`, interaction, true, "reply")
            }

            // TODO: Uncomment this if you want to check for ActionRow
            // if (!message.components || message.components.length === 0 || message.components[0].type !== ComponentType.ActionRow) {
            //     return interaction.reply({
            //         content: `## ${await convertToEmojiPng("error", client.user?.id)} The message does not contain a valid action row for the security gate verification button.`,
            //         flags: MessageFlags.Ephemeral
            //     });
            // }

            await message?.edit({
                components: [
                    new ContainerBuilder()
                        .addActionRowComponents(
                            new ActionRowBuilder<ButtonBuilder>().addComponents(
                                (() => {
                                    const button = new ButtonBuilder()
                                        .setLabel(label)
                                        .setStyle(styleNumber ?? ButtonStyle.Secondary);
                                    if (emoji) {
                                        button.setEmoji(emoji);
                                    }
                                    if (data.ActionType == VerificationActionType.Authorize) {
                                        button.setURL(Config.Modules.Verification.VerifyAuthUrl + "&state=" + data.UUID);
                                    } else {
                                        button.setCustomId(`security-gate-verification-verify:${data?.UUID}`)
                                    }
                                    return button;
                                })()
                            )
                        )
                ]
            });

            return await sendDefaultMessage(`## ${await convertToEmojiToPng("check")} Security gate verification button has been set successfully!`, interaction, true, "reply")
        } catch (error) {
            console.error("Error setting security gate verification button:", error);
            return await sendDefaultMessage(`## ${await convertToEmojiToPng("error")} An error occurred while setting the security gate verification button.`, interaction, true, "reply")
        }
    }
}
