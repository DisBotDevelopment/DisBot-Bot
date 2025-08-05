import {ModalSubmitInteraction} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {all} from "axios";

export default {
    id: "ticket-add-component-modal-show-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */

    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const optionOne = interaction.fields.getTextInputValue("0") ?? null
        const optionTwo = interaction.fields[1] ? interaction.fields?.getTextInputValue("1") : null
        const optionThree = interaction.fields[2] ? interaction.fields?.getTextInputValue("2") : null
        const optionFour = interaction.fields[3] ? interaction.fields?.getTextInputValue("3") : null
        const optionFive = interaction.fields[4] ? interaction.fields?.getTextInputValue("4") : null

        const uuid = interaction.customId.split(":")[1];

        const data = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid
            }
        })

        if (optionOne && optionOne == "DELETE") {
            const modalUUID = data.ModalOptions[0].UUID
            await database.ticketModalData.delete(
                {
                    where: {
                        UUID: modalUUID
                    },

                }
            );
        } else if (optionTwo && optionTwo == "DELETE") {
            const modalUUID = data.ModalOptions[1].UUID
            await database.ticketModalData.delete(
                {
                    where: {
                        UUID: modalUUID
                    },

                }
            );
        } else if (optionThree && optionThree == "DELETE") {
            const modalUUID = data.ModalOptions[2].UUID
            await database.ticketModalData.delete(
                {
                    where: {
                        UUID: modalUUID
                    },

                }
            );
        } else if (optionFour && optionFour == "DELETE") {
            const modalUUID = data.ModalOptions[3].UUID
            await database.ticketModalData.delete(
                {
                    where: {
                        UUID: modalUUID
                    },

                }
            );
        } else if (optionFive && optionFive == "DELETE") {
            const modalUUID = data.ModalOptions[4].UUID
            await database.ticketModalData.delete(
                {
                    where: {
                        UUID: modalUUID
                    },

                }
            );
        }

        const newData = await database.ticketSetups.findFirst({
            include: {
                ModalOptions: true
            },
            where: {
                CustomId: uuid
            }
        })

        if (newData.ModalOptions.length < 1) {
            await database.ticketSetups.update({
                where: {
                    CustomId: uuid
                },
                data: {
                    HasModal: false
                }
            })
        }

        await interaction.deferUpdate();
    }
};
