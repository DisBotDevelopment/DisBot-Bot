import {
    ActionRowBuilder, ButtonBuilder, ButtonComponent,
    ButtonInteraction,
    ButtonStyle, ChannelSelectMenuBuilder, ContainerBuilder,
    MessageFlags,
    ModalBuilder, TextDisplayBuilder,
    TextInputBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {isInDevelopment, sendDefaultMessage} from "../../../helper/utilityHelper.js";
import ms, {StringValue} from "ms";
import {calcXP} from "../../../systems/level/levelMath.js";

export default {
    id: "levels-users-settings-confirm",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const type = interaction.customId.split(":")[1]
        const uuid = interaction.customId.split(":")[2]

        switch (type) {
            case "delete": {

                await database.levels.delete(
                    {
                        where: {
                            UUID: uuid
                        }
                    }
                )
                await interaction.update({
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`## ${await convertToEmojiToPng("check")} Successfully deleted users UserData!`)
                            )
                    ]
                })

            }
                break;
            case "reset-level-data": {

                await database.levels.update(
                    {
                        where: {
                            UUID: uuid
                        },
                        data: {
                            Level: 0,
                            XP: "0",
                            RequiredXp: "0"
                        }
                    }
                )

                await interaction.update({
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                    components: [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`## ${await convertToEmojiToPng("check")} Successfully reset users LevelData!`)
                            )
                    ]
                })
            }
                break;

        }
    }
};
