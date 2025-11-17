import {Events, Invite} from "discord.js";
import {ExtendedClient} from "../../../types/ExtendedClient.js";

export default {
    name: Events.InviteDelete,

    /**
     * @param {Invite} invite
     * @param {ExtendedClient} client
     */
    async execute(invite: Invite, client: ExtendedClient) {
        const cachedInvites = client.inviteTrackerInvitesCache.get(invite.guild!.id);
        if (cachedInvites && cachedInvites.get(invite.code)) {
            cachedInvites.get(invite.code)!.deletedTimestamp = Date.now();
        }
    },
};
