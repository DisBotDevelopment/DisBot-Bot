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

        const guildAutoRolesData = await database.guildAutoRoles.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!guildAutoRolesData) return;
        if (!guildAutoRolesData.RoleId) return;

        try {
            await member.roles.add(guildAutoRolesData.RoleId);
        } catch {
            return;
        }
    }
};
