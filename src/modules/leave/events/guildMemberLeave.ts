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

        const data = await database.guildLeaveSetups.findFirst({
            where: {GuildId: guild.id}
        });
        if (!data?.ChannelId) return;

        const messageTemplate = data.MessageTemplateId
            ? await database.messageTemplates.findFirst({
                where: {Name: data.MessageTemplateId}
            })
            : null;

        const channel = client.channels.cache.get(data.ChannelId) as TextChannel;
        if (!channel) return;

        const replacements = {
            "{member.tag}": `<@${member.id}>`,
            "{member.name}": member.user.tag,
            "{member.globalname}": member.user.globalName ?? "",
            "{member.displayname}": member.displayName,
            "{member.id}": member.id,
            "{guild.name}": guild.name,
            "{guild.id}": guild.id,
            "{guild.membercount}": guild.memberCount.toString(),
            "{guild.owner.tag}": `<@${guild.ownerId}>`,
            "{guild.owner.id}": guild.ownerId,
            "https://i.imgur.com/kjEQRRI.png": member.user.displayAvatarURL(),
            "9250-08-04 00:00": new Date().toLocaleString(),
        };

        const replaceVars = (str?: string) =>
            str
                ? Object.entries(replacements).reduce(
                    (acc, [key, val]) => acc.replaceAll(key, val),
                    str
                )
                : undefined;

        const content = replaceVars(messageTemplate?.Content);
        const embedJson = messageTemplate?.EmbedJSON
            ? JSON.parse(replaceVars(messageTemplate.EmbedJSON))
            : null;

        let imageBuffer = null;
        if (data.Image) {
            imageBuffer = await drawCard({
                theme: (data.ImageData?.Theme as "dark" | "circuit" | "code") ?? "dark",
                text: {
                    title: replaceVars(data.ImageData?.Title) ?? "Goodbye!",
                    subtitle:
                        replaceVars(data.ImageData?.Subtitle) ??
                        `Member Count: ${guild.memberCount}`,
                    text: replaceVars(data.ImageData?.Text) ?? member.user.tag,
                    color: data.ImageData?.Color ?? "#88f"
                },
                avatar: {
                    image: member.displayAvatarURL({extension: "png"}),
                    outlineWidth: 5,
                    outlineColor: new LinearGradient({
                        col: data.ImageData?.Gradient?.split(",")[0] ?? "#fff",
                        off: 0,
                        offset: 1,
                        color: data.ImageData?.Gradient?.split(",")[1] ?? "#000"
                    })
                },
                card: {
                    background: data.ImageData?.Background ?? "https://i.imgur.com/kjEQRRI.png",
                    blur: 1,
                    border: true,
                    rounded: true
                }
            });
        }

        const payload: Parameters<TextChannel["send"]>[0] = {};
        if (embedJson) payload.embeds = [new EmbedBuilder(embedJson)];
        if (content) payload.content = content;
        if (imageBuffer) payload.files = [imageBuffer];

        if (Object.keys(payload).length === 0) return;
        await channel.send(payload);
    }
};
