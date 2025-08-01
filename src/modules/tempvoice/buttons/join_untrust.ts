import {ActionRowBuilder, ButtonInteraction, GuildMember, MessageFlags, UserSelectMenuBuilder} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {convertToEmojiPng} from "../../../helper/emojis.js";
import {database} from "../../../main/database.js";

export default {
    id: "join_untrust",

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(interaction: ButtonInteraction, client: ExtendedClient) {
        const {guild, member} = interaction;
        const data = await database.tempVoiceChannels.findFirst({
            where: {
                GuildId: guild?.id,
                OwnerId: interaction.user.id
            }
        });
        if (!data)
            return interaction.reply({
                content: "There is no channel to rename",
                flags: MessageFlags.Ephemeral
            });

        if (!(interaction.member as GuildMember).voice.channelId)
            return interaction.reply({
                content: "You are not in a voice channel",
                flags: MessageFlags.Ephemeral
            });


        if (!client.user) throw new Error("Client not Found!");

        let owner;
        await convertToEmojiPng("owner", client.user.id).then((result: any) => {
            owner = result;
        });
        if (interaction.user.id !== data.OwnerId)
            return interaction.reply({
                content: `${owner} You are not the owner of this channel or you are not in the channel`,
                flags: MessageFlags.Ephemeral
            });
        const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
            new UserSelectMenuBuilder()
                .setCustomId("join_untrust_sec")
                .setPlaceholder("➡️ Please Select")
                .setMinValues(1)
                .setMaxValues(25)
        );

        interaction.reply({components: [row], flags: MessageFlags.Ephemeral});
    }
};
