import {
    Guild,
    GuildMember,
    Interaction,
    MessageFlags,
    PermissionFlagsBits,
    PermissionResolvable,
    PermissionsBitField
} from "discord.js";
import {DisbotInteractionType} from "../enums/disbotInteractionType.js";
import {PermissionType} from "../enums/permissionType.js";
import {convertToEmojiPng} from "./emojis.js";
import {ExtendedClient} from "../types/client.js";
import {database} from "../main/database.js";

export class InteractionHelper {

    public static async sendReply(interaction: Interaction, emoji: string, message: string) {
        if (!interaction.isRepliable()) return;
        await interaction.reply({
            content: `## ${emoji} ${message}`,
            flags: MessageFlags.Ephemeral,
        });
    }

    public static async getPermissionType(
        permission: PermissionType,
        guild: Guild,
        member: GuildMember,
        client: ExtendedClient,
        interaction: Interaction
    ): Promise<void> {
        const permsData = await database.permissions.findFirst({
            where: {
                GuildId: guild.id
            }
        });
        const permsMember = guild.members.cache.get(member.id);
        const entry = permsData?.Permissions.find(p => p.Type === permission as string);

        if (entry && !permsMember?.roles.cache.has(entry.RoleId as unknown as string)) {
            if (!client.user) throw new Error("Client user is not defined");

            return (interaction as any).reply({
                content: `## ${await convertToEmojiPng("permission", client.user.id)} You need the role <@&${entry.RoleId}> to execute this interaction.`,
                flags: MessageFlags.Ephemeral
            });
        }
    }

    public static async cooldownCheck(cooldown: number, interaction: Interaction, client: ExtendedClient, type: DisbotInteractionType) {
        const now = Date.now();

        if (type == DisbotInteractionType.Command || type == DisbotInteractionType.SubCommand || type == DisbotInteractionType.SubCommandGroup) {
            if (!interaction.isCommand()) return;
            const cooldownTime = cooldown ? cooldown : 3000;
            const cooldownKey = `${interaction.commandName}:${interaction.user.id}`;

            if (cooldown && client.cooldowns?.has(cooldownKey)) {
                const expiration = client.cooldowns.get(cooldownKey)! + cooldownTime;
                if (now < expiration) {
                    const emoji = await convertToEmojiPng("timer", client.user!.id);
                    const timestamp = Math.floor(expiration / 1000);

                    return await this.sendReply(interaction, emoji, `Please wait <t:${timestamp}:R> before using this command again.`)
                }
            }

            client.cooldowns?.set(cooldownKey, now);
            setTimeout(() => client.cooldowns?.delete(cooldownKey), cooldownTime);
        }
    }

    public static async checkBotPermissions(
        interaction: Interaction,
        client: ExtendedClient,
        botPermissions: PermissionResolvable[]
    ): Promise<void> {
        if (!interaction.guild) return

        const missingPermissions = botPermissions.filter(permission => !interaction.guild?.members.me?.permissions.has(permission));

        if (missingPermissions.length > 0) {
            const emoji = await convertToEmojiPng("permission", client.user!.id);
            const bitfield = missingPermissions.reduce((a, b) => a | Number(b), 0);
            const readable = new PermissionsBitField(BigInt(bitfield)).toArray();
            const formatted = readable.map(p => `\`${p}\``).join(", ");

            return (interaction as any).reply({
                content: `## ${emoji} OoO, I need the following permissions to execute this interaction: \`${formatted}\``,
                flags: MessageFlags.Ephemeral
            });
        }
    }

    public static async checkUserPermissions(
        interaction: Interaction,
        client: ExtendedClient,
        userPermissions: PermissionResolvable[]
    ): Promise<void> {
        if (!interaction.guild) return

        const permsData = await database.permissions.findFirst(
            {
                where: {
                    GuildId: interaction.guild.id
                }
            }
        )

        const ignore = permsData.Permissions.find(p => p.Type == PermissionType.IgnoreDiscordPermissionRequirement);

        if (!ignore) {
            const missingPermissions = userPermissions.filter(permission => !(interaction.member as GuildMember).permissions.has(permission));

            if (missingPermissions.length > 0) {
                const emoji = await convertToEmojiPng("permission", client.user!.id);
                const bitfield = missingPermissions.reduce((a, b) => a | Number(b), 0);
                const readable = new PermissionsBitField(BigInt(bitfield)).toArray();
                const formatted = readable.map(p => `\`${p}\``).join(", ");


                return (interaction as any).reply({
                    content: `## ${emoji} OoO, You need the following permissions to execute this interaction: \`${formatted}\``,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }

    public static async checkUserHasOnePermission(
        interaction: Interaction,
        userPermissions: PermissionResolvable[],
        permission: PermissionType
    ): Promise<void> {
        if (!interaction.guild) return
        const guild = interaction.guild;
        const member = interaction.member as GuildMember;

        const missingPermissions = userPermissions.filter(permission => !(interaction.member as GuildMember).permissions.has(permission));
        const permsData = await database.permissions.findFirst({
            where: {
                GuildId: guild.id
            }
        });
        const permsMember = guild.members.cache.get(member.id);
        const entry = permsData?.Permissions.find(p => p.Type === permission as string);

        if ((entry && !permsMember?.roles.cache.has(entry.RoleId as unknown as string)) && (missingPermissions && missingPermissions.length > 0)) {
            const emoji = await convertToEmojiPng("permission", interaction.client.user!.id);
            const bitfield = missingPermissions.reduce((a, b) => a | Number(b), 0);
            const readable = new PermissionsBitField(BigInt(bitfield)).toArray();
            const formatted = readable.map(p => `\`${p}\``).join(", ");


            return (interaction as any).reply({
                content: `## ${emoji} OoO, You lack one of the requirements!\n\nYou need the role <@&${entry.RoleId}> to execute this interaction.\nOr you need the following permissions: ${formatted}`,
                flags: MessageFlags.Ephemeral
            });
        }
    }

    public static async checkGuildOwner(interaction: Interaction, client: ExtendedClient): Promise<void> {
        if (!interaction.guild) return
        const guild = interaction.guild;
        const member = interaction.member as GuildMember;

        if (guild.ownerId !== member.id) {
            const emoji = await convertToEmojiPng("permission", client.user!.id);

            return (interaction as any).reply({
                content: `## ${emoji} OoO, You need to be the server owner to execute this interaction.`,
                flags: MessageFlags.Ephemeral
            })
        }
    }

}