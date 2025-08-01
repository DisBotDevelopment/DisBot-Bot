import {Events, Invite} from "discord.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    name: Events.InviteDelete,

    /**
     * @param {Invite} invite
     * @param {ExtendedClient} client
     */
    async execute(invite: Invite, client: ExtendedClient) {
        const cachedInvites = client.inviteTracker.invitesCache.get(invite.guild!.id);
        if (cachedInvites && cachedInvites.get(invite.code)) {
            cachedInvites.get(invite.code)!.deletedTimestamp = Date.now();
        }
    },
};
