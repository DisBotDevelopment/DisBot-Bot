import {
    ActionRowBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder, LabelBuilder,
    MessageFlags,
    ModalBuilder, ModalSubmitInteraction,
    TextInputBuilder, TextInputStyle
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import {NUM} from "undici/lib/llhttp/constants.js";
import {IDisBotInteraction} from "../../../types/Interaction.js";

export default {
    id: "levels-user-settings-select-modal",

    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ModalSubmitInteraction, client: ExtendedClient) {
        const uuid = interaction.customId.split(":")[2]
        const input = interaction.fields.getTextInputValue("input")

        const userData = await database.levels.findFirst(
            {
                where: {
                    UUID: uuid
                },
            }
        )

        switch (interaction.customId.split(":")[1]) {
            case "level-add": {

                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            Level: (userData.Level + parseInt(input)),
                        }
                    }
                )
            }
                break;
            case "level-set": {
                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            Level: (parseInt(input)),
                        }
                    }
                )
            }
                break;
            case "xp-add": {
                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            XP: `${(parseInt(userData.XP) + parseInt(input))}`,
                        }
                    }
                )
            }
                break;
            case "xp-set": {
                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            XP: `${parseInt(input)}`,
                        }
                    }
                )
            }
                break;
        }

        await interaction.deferUpdate()
    }
}
