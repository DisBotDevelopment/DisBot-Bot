import {
    ApplicationCommandType,
    ButtonStyle,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    PermissionFlagsBits
} from "discord.js";
import { ExtendedClient } from "types/client.js";

export default {
    context: true,
    data: new ContextMenuCommandBuilder()
        .setName("User Avatar")
        .setNameLocalizations({
            "en-GB": "User Avatar",
            de: "Nutzer Avatar",
            "en-US": "User Avatar"
        })

        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .setDMPermission(false)
        .setType(ApplicationCommandType.User),

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ContextMenuCommandInteraction,
        client: ExtendedClient
    ) {
        const { guild } = interaction;
        const getMember = await guild?.members.fetch(interaction.targetId);

        const getMemberObj = await guild?.members.fetch(getMember);

        if (!getMemberObj) throw new Error("Member not found");
        if (!getMember) throw new Error("Member not found");

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setDescription(`${getMemberObj ? getMember?.user : "Your"} Avatar`)
                    .setFooter({
                        text: getMember.id,
                        iconURL: getMember.displayAvatarURL()
                    })
                    .setImage(
                        `${getMember.displayAvatarURL({
                            extension: "png",
                            forceStatic: true,
                            size: 512
                        })}`
                    )
                    .setTimestamp()
            ],
            flags: MessageFlags.Ephemeral
        });
    }
};
