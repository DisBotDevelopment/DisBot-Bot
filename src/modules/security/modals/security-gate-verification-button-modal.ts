import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    GuildChannel,
    MessageFlags,
    ModalSubmitInteraction,
    TextBasedChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {VerificationActionType} from "../../../enums/verification.js";
import {database} from "../../../main/database.js";
import {Config} from "../../../main/config.js";

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
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} No security gate verification action found for this button.`,
                flags: MessageFlags.Ephemeral
            });
        }


        const label = interaction.fields.getTextInputValue("security-gate-verification-button-label");
        const emoji = interaction.fields.getTextInputValue("security-gate-verification-button-emoji");
        const style = interaction.fields.getTextInputValue("security-gate-verification-button-style");

        if (!client.user) throw new Error("Client user is not defined.");
        if (!label) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You must provide a label for the button.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (!style || !["PRIMARY", "SECONDARY", "SUCCESS", "DANGER", "LINK"].includes(style.toUpperCase())) {
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} You must provide a valid style for the button. Valid styles are: PRIMARY, SECONDARY, SUCCESS, DANGER, LINK.`,
                flags: MessageFlags.Ephemeral
            });
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
                return interaction.reply({
                    content: `## ${await convertToEmojiPng("error", client.user?.id)} The message for the security gate verification button was not found.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            // TODO: Uncomment this if you want to check for ActionRow
            // if (!message.components || message.components.length === 0 || message.components[0].type !== ComponentType.ActionRow) {
            //     return interaction.reply({
            //         content: `## ${await convertToEmojiPng("error", client.user?.id)} The message does not contain a valid action row for the security gate verification button.`,
            //         flags: MessageFlags.Ephemeral
            //     });
            // }

            message?.edit({
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        (() => {
                            const button = new ButtonBuilder()
                                .setCustomId(`security-gate-verification-verify:${data?.UUID}`)
                                .setLabel(label)
                                .setStyle(styleNumber ?? ButtonStyle.Secondary);
                            if (emoji) {
                                button.setEmoji(emoji);
                            }
                            // TODO: Replace with actual URL if needed
                            if (data.ActionType == VerificationActionType.Authorize) {
                                button.setURL(Config.Modules.Verification.VerifyAuthUrl + "&state=" + data.UUID);
                            }
                            return button;
                        })()
                    )
                ]
            });


            await interaction.reply({
                content: `## ${await convertToEmojiPng("check", client.user?.id)} Security gate verification button has been set successfully!`,
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error("Error setting security gate verification button:", error);
            return interaction.reply({
                content: `## ${await convertToEmojiPng("error", client.user?.id)} An error occurred while setting the security gate verification button.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
}
