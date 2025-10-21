import {
    ActionRowBuilder, AttachmentBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    ChannelType,
    ContainerBuilder, FileBuilder,
    MessageFlags,
    TextChannel,
    TextDisplayBuilder
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";

export default {
    id: "utility-export-user",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {

        const data = await database.users.findFirst({
            include: {
                Apis: true,
                Vanitys: {
                    include: {
                        Embed: {
                            include: {
                                Author: true
                            }
                        },
                        Analytics: {
                            include: {
                                Latest30Days: true
                            }
                        }
                    }
                },
                GuildBackups: true
            },
            where: {
                UserId: interaction.user.id
            }
        })

        const string = JSON.stringify(data)

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiToPng("export")} Download your UserData Export ${new Date().toDateString()}`)
                    )
                    .addFileComponents(
                        new FileBuilder().setURL(`attachment://UserData-${interaction.user.displayName}.json`).setSpoiler(true)
                    )
            ],
            files: [
                new AttachmentBuilder(Buffer.from(string)).setName(`UserData-${interaction.user.displayName}.json`),
            ]
        })


    }
};
