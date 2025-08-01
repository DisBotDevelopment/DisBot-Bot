import {Events, type Guild, Invite} from "discord.js";
import {mapInviteData} from "../../../systems/inviteTracker/guildFetcher.js";
import {fetchGuildCache} from "../../../systems/inviteTracker/inviteTracker.js";
import {ExtendedClient} from "../../../types/client.js";

export default {
    name: Events.InviteCreate,

    /**
     * @param {Invite} invite
     * @param {ExtendedClient} client
     */
    async execute(invite: Invite, client: ExtendedClient) {
        await fetchGuildCache(client, invite.guild as Guild, true);
        if (client.inviteTracker.invitesCache.get(invite.guild!.id)) {
            client.inviteTracker.invitesCache.get(invite.guild!.id)!.set(invite.code, mapInviteData(invite));
        }
    },
};
