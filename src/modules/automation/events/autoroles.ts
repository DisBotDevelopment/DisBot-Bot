import {ChannelType, Events, GuildMember} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.GuildMemberAdd,

    /**
     *
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */
    async execute(member: GuildMember, client: ExtendedClient) {
        const {guild} = member;

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!toggleData) return;
        if (toggleData.AutorolesEnabled == false) return;

        const guildAutoRolesData = await database.guildAutoRoles.findMany({
            where: {
                GuildId: guild.id
            }
        });

        if (!guildAutoRolesData) return;

        for (const guildAutoRole of guildAutoRolesData) {
            if (!guildAutoRole.RoleId) continue;

            try {
                await member.roles.add(guildAutoRole.RoleId);
            } catch {
            }
        }
    }
};
