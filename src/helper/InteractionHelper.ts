import {
    Guild,
    GuildMember,
    Interaction,
    MessageFlags,
    PermissionFlagsBits,
    PermissionResolvable,
    PermissionsBitField
} from "discord.js";
import {DisBotInteractionType} from "../enums/disBotInteractionType.js";
import {PermissionType} from "../enums/permissionType.js";
import {convertToEmojiToPng} from "./emojis.js";
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

    public static async cooldownCheck(cooldown: number, interaction: Interaction, client: ExtendedClient, type: DisBotInteractionType) {
        const now = Date.now();

        if (!interaction.isCommand()) return;
        const cooldownTime = cooldown ? cooldown : 3000;
        const cooldownKey = `${interaction.commandName}:${interaction.user.id}`;

        if (cooldown && client.cooldowns?.has(cooldownKey)) {
            const expiration = client.cooldowns.get(cooldownKey)! + cooldownTime;
            if (now < expiration) {
                const emoji = await convertToEmojiToPng("timer");
                const timestamp = Math.floor(expiration / 1000);

                return await this.sendReply(interaction, emoji, `Please wait <t:${timestamp}:R> before using this command again.`)
            }
        }

        client.cooldowns?.set(cooldownKey, now);
        setTimeout(() => client.cooldowns?.delete(cooldownKey), cooldownTime);
    }

    public static async checkBotPermissions(
        interaction: Interaction,
        client: ExtendedClient,
        botPermissions: PermissionResolvable[]
    ): Promise<void> {
        if (!interaction.guild) return

        const missingPermissions = botPermissions.filter(permission => !interaction.guild?.members.me?.permissions.has(permission));

        if (missingPermissions.length > 0) {
            const emoji = await convertToEmojiToPng("permission");
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

        const missingPermissions = userPermissions.filter(permission => !(interaction.member as GuildMember).permissions.has(permission));

        if (missingPermissions.length > 0) {
            const emoji = await convertToEmojiToPng("permission");
            const bitfield = missingPermissions.reduce((a, b) => a | Number(b), 0);
            const readable = new PermissionsBitField(BigInt(bitfield)).toArray();
            const formatted = readable.map(p => `\`${p}\``).join(", ");


            return (interaction as any).reply({
                content: `## ${emoji} OoO, You need the following permissions to execute this interaction: \`${formatted}\``,
                flags: MessageFlags.Ephemeral
            });
        }

    }

    public static async checkGuildOwner(interaction: Interaction, client: ExtendedClient): Promise<void> {
        if (!interaction.guild) return
        const guild = interaction.guild;
        const member = interaction.member as GuildMember;

        if (guild.ownerId !== member.id) {
            return await (interaction as any).reply({
                content: `## ${await convertToEmojiToPng("permission")} OoO, You need to be the server owner to execute this interaction.`,
                flags: MessageFlags.Ephemeral
            })
        }
    }

    public static async channelRequirements(interaction: Interaction, client: ExtendedClient, channels: string[]) {
        return !channels.includes(interaction.channelId);
    }

    public static async userRequirements(
        interaction: Interaction,
        client: ExtendedClient,
        users: string[]
    ) {
        return users.includes(interaction.user.id);
    }


    public static async roleRequirements(interaction: Interaction, client: ExtendedClient, roles: string[]) {
        const member = interaction.member as GuildMember;
        for (const role of member.roles.cache.map((r) => r)) {
            if (roles.includes(role.id)) {
                return true
            }
        }
        return false;
    }
}