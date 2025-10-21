import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Events,
    PermissionFlagsBits,
    PermissionsBitField,
    VoiceState
} from "discord.js";
import {convertToEmojiToPng} from "../../../helper/emojis.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {ExtendedClient} client
     */
    async execute(
        oldState: VoiceState,
        newState: VoiceState,
        client: ExtendedClient
    ) {
        const {guild, member} = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        const data = await database.tempVoiceChannels.findFirst({
            where: {
                ChannelId: oldChannel?.id
            }
        });
        if (data &&
            data?.ChannelId &&
            oldChannel?.id == data.ChannelId &&
            oldChannel.members.size == 0 &&
            (!newChannel || newChannel.id !== data.ChannelId)
        ) {
            oldChannel.delete("Your Channel Deleted").catch((error) => {
                console.log(error);
            });
            await database.tempVoiceChannels.delete({
                where: {
                    ChannelId: oldChannel.id
                }
            }).catch((error) => {
                console.log(error);
            })
            return
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("join_rename")
                .setEmoji("<:renamesolid24:1259433901554929675>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("join_limit")
                .setEmoji("<:user:1259432940383768647>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("join_privcy")
                .setEmoji("<:shieldquarter:1259432930909098096>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("join_trust")
                .setEmoji("<:usercheck:1259432938890727446>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("join_untrust")
                .setEmoji("<:userx:1259432937087172659>")
                .setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("join_kick")
                .setEmoji("<:uservoice:1259432935157792840>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("join_region")
                .setEmoji("<:globe:1259432929453674506>")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("join_transfer")
                .setEmoji("<:crown:1259432933886791681>")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("join_delete")
                .setEmoji("<:trash:1259432932234367069>")
                .setStyle(ButtonStyle.Secondary)
        );

        const tempVoices = await database.tempVoices.findMany({
            include: {
                TempVoiceChannels: true
            },
            where: {
                GuildId: guild.id
            }
        });


        for (const tempVoice of tempVoices) {
            if (newState.channelId == tempVoice?.JointoCreateChannel) {
                const parent = await guild.channels.fetch(
                    tempVoice.JointoCreateCategory as string
                );

                for (const tempChannel of tempVoice.TempVoiceChannels) {
                    if (member.id == tempChannel.OwnerId) {
                        return;
                    }
                }

                if (!tempVoices) return;
                if (tempVoices.length <= 0) return;
                if (oldChannel == newChannel) return;

                // Add Placeholder like {count} to the name
                const name = tempVoice.Name
                    ? tempVoice.Name
                    : member?.user.username + "'s Channel";

                if (!name) throw new Error("Name is not defined");

                const vc = await guild.channels
                    .create({
                        name: tempVoice?.Name
                            ? name
                                .replace(
                                    "{member.username}",
                                    member?.user.username as string
                                )
                                .replace(
                                    "{member.globalname}",
                                    member?.user.globalName as string
                                )
                                .replace("{member.id}", member?.user.id as string)
                            : `${member?.user.username}'s Channel`,
                        type: ChannelType.GuildVoice,
                        parent: parent?.id,
                        userLimit: tempVoice.PresetLimit || 0,
                        permissionOverwrites: [
                            {
                                id: member?.id as string,
                                allow: [
                                    PermissionsBitField.Flags.Connect,
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.DeafenMembers,
                                    PermissionsBitField.Flags.MuteMembers,
                                    PermissionsBitField.Flags.MoveMembers
                                ]
                            }
                        ]
                    })
                    .then(async (channel) => {
                        await member?.voice.setChannel(channel);

                        if (!client.user) throw new Error("Client user is not defined");

                        let renamesolid24;
                        await convertToEmojiToPng("renamesolid24").then(
                            (emoji: any) => {
                                renamesolid24 = emoji;
                            }
                        );
                        let user;
                        await convertToEmojiToPng("user").then(
                            (emoji: any) => {
                                user = emoji;
                            }
                        );
                        let shieldquarter;
                        await convertToEmojiToPng("shieldquarter").then(
                            (emoji: any) => {
                                shieldquarter = emoji;
                            }
                        );
                        let usercheck;
                        await convertToEmojiToPng("usercheck").then(
                            (emoji: any) => {
                                usercheck = emoji;
                            }
                        );
                        let userx;
                        await convertToEmojiToPng("userx").then(
                            (emoji: any) => {
                                userx = emoji;
                            }
                        );
                        let uservoice;
                        await convertToEmojiToPng("uservoice").then(
                            (emoji: any) => {
                                uservoice = emoji;
                            }
                        );
                        let globe;
                        await convertToEmojiToPng("globe").then(
                            (emoji: any) => {
                                globe = emoji;
                            }
                        );
                        let crown;
                        await convertToEmojiToPng("crown").then(
                            (emoji: any) => {
                                crown = emoji;
                            }
                        );
                        let trash;
                        await convertToEmojiToPng("trash").then(
                            (emoji: any) => {
                                trash = emoji;
                            }
                        );
                        if (tempVoice.Manage == false) {
                            await channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Manage Your Channel`)
                                        .setColor("#2B2D31")
                                        // .setImage("https://i.ibb.co/HT0Wsfr/disbotsvcimage.png")
                                        .setDescription(
                                            [
                                                `### Click on the buttons to manage your channel`,
                                                ``,
                                                ``,
                                                `** ${renamesolid24}** - Rename Channel`,
                                                `** ${user}** - Limit User`,
                                                `** ${shieldquarter}** - Privacy`,
                                                `** ${usercheck}** - Trust User`,
                                                `** ${userx}** - Untrust User`,
                                                `** ${uservoice}** - Kick User`,
                                                `** ${globe}** - Change Region`,
                                                `** ${crown}** - Transfer Ownership`,
                                                `** ${trash}** - Delete Channel`
                                            ].join("\n")
                                        )

                                        .setFooter({
                                            text: `Manage Your Voice Channel`,
                                            iconURL: guild.iconURL() as string
                                        })
                                ],
                                components: [row, row2]
                            });
                        }

                        await database.tempVoiceChannels.create({
                            data: {
                                GuildId: guild.id,
                                ChannelId: channel.id,
                                OwnerId: member?.id,
                                TempVoiceId: tempVoice.UUID
                            }
                        });
                    });
            }
        }
    },

    name: Events.VoiceStateUpdate
};
