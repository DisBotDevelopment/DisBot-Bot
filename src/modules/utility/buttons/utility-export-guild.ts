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
import {ticketActionsHelper} from "../../../helper/ticketHelper.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";

export default {
    id: "utility-export-user",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {


        if (interaction.user.id != interaction.guild.ownerId) {
            return;
        }

        const data = await database.guilds.findFirst({
            include: {},
            where: {
                GuildId: interaction.guild.id
            }
        })

        const string = JSON.stringify(data)

        await interaction.reply({
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## ${await convertToEmojiPng("export", client.user.id)} Download your GuildData Export ${new Date().toDateString()}`)
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
