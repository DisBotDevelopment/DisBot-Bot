import {Events, GuildMember} from "discord.js";
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
        const {me} = guild.members;

        const toggleData = await database.guildFeatureToggles.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!toggleData) return;
        if (toggleData.AutorolesEnabled == false) return;

        const autoRolesData = await database.autoRoles.findFirst({
            where: {
                GuildId: guild.id
            }
        });

        if (!autoRolesData) return;
        if (!autoRolesData.RoleId) return;

        try {
            await member.roles.add(autoRolesData.RoleId);
        } catch {
            return;
        }
    }
};
