import {ButtonStyle, ChannelType, MessageFlags, ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";
import {NUM} from "undici/lib/llhttp/constants.js";
import {randomUUID} from "crypto";
import {cli} from "winston/lib/winston/config/index.js";

export default {
    id: "ticket-add-component-modal-add-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[1];
        const name = interaction.fields.getTextInputValue(
            "label"
        );
        const placeholder = interaction.fields.getTextInputValue(
            "placeholder"
        );
        const required = interaction.fields.getTextInputValue(
            "required"
        );
        const minmaxLength = interaction.fields.getTextInputValue(
            "minmaxlength"
        );

        let types: number
        try {
            types = Number(interaction.fields.getTextInputValue(
                "type"
            ))
        } catch (error) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} You need to set a number 1 of Short and 2 for Paragraph`
            })
        }

        if (!client.user) throw new Error("Client user is not cached");

        let type: number
        if (types == 1) type = 1;
        else if (types == 2) type = 2;
        else {
            return interaction.reply({
                content: `## ${await convertToEmojiPng(
                    "error",
                    client.user.id
                )} Please select a valid type`,
                flags: MessageFlags.Ephemeral
            });
        }
        try {
            await database.ticketModalData.create({
                data: {
                    TicketSetup: {
                        connect: {
                            CustomId: uuid
                        }
                    },
                    MaxLength: minmaxLength.split(",")[1] ? Number(minmaxLength.split(",")[1]) : null,
                    MinLength: minmaxLength.split(",")[0] ? Number(minmaxLength.split(",")[0]) : null,
                    UUID: randomUUID(),
                    Name: name,
                    Type: type,
                    Required: required ? Boolean(required) : false,
                    Placeholder: placeholder ? placeholder : null,
                }
            })
        } catch (error) {
            return await interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: `## ${await convertToEmojiPng("error", client.user.id)} Please select a valid Min-/Max-Length and Required Option!`,
            })
        }

        await interaction.reply({
            flags: MessageFlags.Ephemeral,
            content: `## ${await convertToEmojiPng("check", client.user.id)} Added Modal Option successfully!`
        })

    }
}