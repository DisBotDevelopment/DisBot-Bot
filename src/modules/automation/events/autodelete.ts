import {ChannelType, Events, Message} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";
import {database} from "../../../main/database.js";

export default {
    name: Events.MessageCreate,

    async execute(
        message: Message,
        client: ExtendedClient
    ) {

        if (message.channel.type == ChannelType.DM) return;
        if (message.author.bot) return;

        const deleteSetups = await database.guildAutoDeletes.findMany({
            where: {
                GuildId: message.guildId ?? "",
                IsActive: true
            }
        });
        if (!deleteSetups) return
        if (deleteSetups.length <= 0) return;
        for (const setup of deleteSetups) {
            const whitelistedMessages = setup.WhitelistedMessages;
            const whitelistedUsers = setup.WhitelistedUsers;
            const whitelistedRoles = setup.WhitelistedRoles;


            setTimeout(async () => {

                if (
                    whitelistedMessages.includes(message.id) ||
                    whitelistedUsers.includes(message.author.id) ||
                    message.member?.roles.cache.some(role => whitelistedRoles.includes(role.id))
                ) {
                    return;
                }

                await message.delete().catch(() => {
                });
            }, Number(setup.Time));
        }
    }
};
