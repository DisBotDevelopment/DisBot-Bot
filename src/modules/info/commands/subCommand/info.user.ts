import axios from "axios";
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
    MessageFlags,
    PermissionFlagsBits,
    PermissionsString
} from "discord.js";
import {ExtendedClient} from "../../../../types/client.js";
import {convertToEmojiGif, convertToEmojiPng} from "../../../../helper/emojis.js";
import {PermissionType} from "../../../../enums/permissionType.js";
import {Config} from "../../../../main/config.js";

export default {
    subCommand: "info.user", options: {
        once: false,
        permission: PermissionType.Info,
        cooldown: 3000,
        botPermissions: [],
        userPermissions: [PermissionFlagsBits.UseApplicationCommands],
        userHasOnePermission: true,
        isGuildOwner: false,
    },
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {ExtendedClient} client
     */
    async execute(
        interaction: ChatInputCommandInteraction,
        client: ExtendedClient
    ) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });
        if (!client.user) throw new Error("Client user not found");
        if (!interaction.guild) throw new Error("Guild not found");
        if (!interaction.member) throw new Error("Member not found");

        const getMember =
            (interaction.options.getMember("user") as GuildMember) ||
            (interaction.member as GuildMember);

        let loading;
        await convertToEmojiGif("loading", client.user.id).then((emoji) => {
            loading = emoji;
        });

        await interaction.editReply({
            content: `${loading} Loading User Information...
        `
        });

        const badgeMap = {
            ActiveDeveloper: "devicon",
            BugHunterLevel1: "bug1",
            BugHunterLevel2: "bug2",
            PremiumEarlySupporter: "discordsupporter",
            Partner: "partner",
            Staff: "staff",
            HypeSquadOnlineHouse1: "bravery", // bravery
            HypeSquadOnlineHouse2: "brilliance", // brilliance
            HypeSquadOnlineHouse3: "balance" // balance
        };

        async function addBadges(badgeNames: (keyof typeof badgeMap)[]) {
            if (!badgeNames.length) return ["``none``"];

            const badges = await Promise.all(
                badgeNames.map(async (badge) => {
                    if (!client.user) throw new Error("Client user not found");
                    if (badgeMap[badge]) {
                        const emoji = await convertToEmojiPng(
                            badgeMap[badge],
                            client.user?.id
                        );

                        return ` ${emoji} `;
                    }
                    return null;
                })
            );

            return badges.filter(Boolean);
        }

        let rolemap = (getMember as GuildMember).roles.cache
            .sort((a, b) => b.position - a.position)
            .map((r) => r)
            .slice(0, 15);

        if (!rolemap.length) rolemap = [];

        let boost;
        await convertToEmojiPng("boost", client.user.id).then((emoji) => {
            boost = emoji;
        });

        const booster = (getMember as GuildMember).premiumSince
            ? `${boost}`
            : "``false``";

        let permissions: string | PermissionsString[] = (
            getMember as GuildMember
        ).permissions
            .toArray()
            .map((r) => r)
            .slice(0, 30);

        if (
            (getMember as GuildMember).guild.ownerId == (getMember as GuildMember).id
        )
            permissions = "``Owner``";

        let data = await axios.get(
            `https://discord.com/api/v10/users/${getMember.id}`,
            {
                headers: {
                    Authorization: `Bot ${Config.Bot.DiscordBotToken}`
                }
            }
        );

        await interaction.editReply({
            content: " ",
            embeds: [
                new EmbedBuilder()
                    .setColor("#2B2D31")
                    .setTimestamp()
                    .setThumbnail(
                        (getMember as GuildMember).displayAvatarURL({size: 512})
                    )
                    .setDescription(
                        [
                            `## Informationen about ${getMember.user.username}`,
                            `> 🌍 **Nick Name**: ${getMember}`,
                            `> 🌍 **Name**: \`\`${getMember.user.username}\`\``,
                            `> 🌍 **Global Name**: \`\`${getMember.user.globalName}\`\``,
                            `> 🪪 **ID**: \`\`${getMember.id}\`\``,
                            `> 🎨 **Badges**: ${await addBadges(
                                ((getMember as GuildMember).user.flags
                                    ?.toArray()
                                    .filter(
                                        (flag) => flag in badgeMap
                                    ) as (keyof typeof badgeMap)[]) || []
                            )} (User)`,
                            `> ${boost} **Booster**: ${booster}`,
                            `> 🕙 **Joined the Guild**: <t:${Math.floor(
                                (getMember.joinedTimestamp as number) / 1000
                            )}:R>`,
                            `> 🕙 **Account Created**: <t:${Math.floor(
                                getMember.user.createdTimestamp / 1000
                            )}:R>`,
                            ``,
                            `> 📚 **Roles**: [ ${rolemap.join(` `).replace("@everyone", "") || "None"
                            }]`,
                            ``,
                            `> 🛡️ **Permissions**: [ ${permissions} ]`,
                            ``,
                            `> [**Profile**](https://discord.com/users/${getMember.id})`,
                            `> ${getMember?.displayAvatarURL
                                ? `[**Avatar**](${getMember.displayAvatarURL({size: 512})})`
                                : "**No Avatar**"
                            }`,
                            `> ${data?.data?.banner
                                ? `[**Banner**](https://cdn.discordapp.com/banners/${getMember.id}/${data?.data?.banner}.webp?size=1024)`
                                : "**No Banner**"
                            }`,
                            `> ${data?.data?.avatar_decoration_data?.asset
                                ? `[**Avatar Decoration**](https://cdn.discordapp.com/avatar-decoration-presets/${data.data.avatar_decoration_data.asset})`
                                : "**No Avatar Decoration**"
                            }`
                        ].join("\n")
                    )
                    .setImage(
                        data?.data?.banner
                            ? `https://cdn.discordapp.com/banners/${data?.data?.id}/${data?.data?.banner}.png?size=4096`
                            : null
                    )
            ]
        });
    }
};
