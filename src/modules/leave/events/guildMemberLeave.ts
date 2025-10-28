import {
    AttachmentBuilder,
    EmbedBuilder,
    Events,
    GuildMember,
    MessageCreateOptions,
    MessagePayload,
    TextChannel
} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {drawCard, LinearGradient} from "discord-welcome-card";
import {database} from "../../../main/database.js";
import {drawCardCanvas, uploadToCDN} from "../../../helper/utilityHelper.js";
import {replacePlaceholders} from "../../../main/placeholder.js";
import {MessageBuilder} from "../../../helper/messageHelper.js";

export default {
    name: Events.GuildMemberRemove,

    /**
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */
    async execute(member: GuildMember, client: ExtendedClient) {
        const {guild} = member;

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {GuildId: guild.id}
        });
        if (!toggleData?.LeaveEnabled) return;

        const data = await database.guildLeaveSetup.findFirst({
            include: {
                ImageData: true
            },
            where: {GuildId: guild.id}
        });
        if (!data?.ChannelId) return;

        const messageData = data.MessageTemplateId
            ? await database.messageTemplates.findFirst({
                where: {Name: data.MessageTemplateId}
            })
            : null;

        const channel = client.channels.cache.get(data.ChannelId) as TextChannel;
        if (!channel) return;

        const replacements = {
            member: {
                tag: `<@${member.id}>`,
                name: member.user.globalName,
                globalName: member.user.globalName,
                displayName: member.user.displayName,
                id: member.id,
                avatar: member.user.displayAvatarURL(),
            },
            guild: {
                name: guild.name,
                id: guild.id,
                memberCount: guild.memberCount,
                owner: {
                    tag: `<@${guild.ownerId}>`,
                    id: guild.ownerId
                }
            },
            current: {
                date: new Date().toLocaleString()
            },
        };

        const imageBuffer = await drawCardCanvas({
            theme: (data.ImageData?.Theme as "dark" | "circuit" | "code") ?? "dark",
            text: {
                title: replacePlaceholders(data.ImageData?.Title, replacements) ?? "Welcome!",
                subtitle:
                    replacePlaceholders(data.ImageData?.Subtitle, replacements) ??
                    `Member Count: ${guild.memberCount}`,
                text: replacePlaceholders(data.ImageData?.Text, replacements) ?? member.user.tag,
                color: data.ImageData?.Color ?? "#88f"
            },
            avatar: {
                image: member.displayAvatarURL({extension: "png"}),
                outlineWidth: 5,
                outlineColor: data.ImageData?.Gradient?.split(",")[0] ?? "#fff"
            },
            card: {
                background: data.ImageData?.Background ?? "https://cdn.xyzhub.link/u/czdZgx.png",
                blur: 1,
                border: true,
                rounded: true
            }
        });
        const cdnUrl = await uploadToCDN(imageBuffer)

        const withImagePlaceholder = {
            ...replacements,
            leave: {
                image: cdnUrl,
            },
        }

        const message = await MessageBuilder(
            messageData,
            withImagePlaceholder
        )
        await channel.send(message.messageData)
    }
};
