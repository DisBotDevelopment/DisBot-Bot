import {Events, GuildMember} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";
import {database} from "../../../main/database.js";


export default {
    name: Events.GuildMemberRemove,

    /**
     * @param {GuildMember} member
     * @param {ExtendedClient} client
     */
    async execute(
        member: GuildMember,
        client: ExtendedClient
    ) {

        const data = await database.verificationGates.findMany({
            where: {
                SecurityId: member.guild.id,
            }
        });

        if (!data) return;
        for (const gate of data) {
            if (gate.VerifiedUsers.includes(member.id)) {
                await database.verificationGates.update(
                    {
                        where: {
                            UUID: gate.UUID
                        },
                        data: {
                            VerifiedUsers: {
                                set: gate.VerifiedUsers.filter((f) => f != member.id),
                            }
                        }
                    },
                );
            }
        }
    },
};
