import {Client, Collection, type Snowflake} from "discord.js";
import {TrackedInviteData, VanityInviteData} from "../systems/inviteTracker/inviteTrackerTypes.js";
import {Logger} from "../main/logger.js";
import {IDisBotCommand, IDisBotEvent, IDisBotInteractive} from "./Interaction.js";

export class ExtendedClient extends Client {

    // Interactions
    public commands?: Collection<string, IDisBotCommand> = new Collection();
    public subCommands?: Collection<string, IDisBotCommand> = new Collection();
    public subCommandGroups?: Collection<string, IDisBotCommand> = new Collection();
    
    public guildCommands?: Collection<string, IDisBotCommand> = new Collection();
    public guildSubCommands?: Collection<string, IDisBotCommand> = new Collection();
    
    public buttons?: Collection<string, IDisBotInteractive> = new Collection();
    public selectmenus?: Collection<string, IDisBotInteractive> = new Collection();
    public modals?: Collection<string, IDisBotInteractive> = new Collection();
    public events?: Collection<string, IDisBotEvent> = new Collection();

    // Cooldown
    public cooldowns?: Collection<any, any> = new Collection();

    // Invite Manager
    public inviteTrackerInvitesCache: Collection<Snowflake, Collection<string, TrackedInviteData>> = new Collection();
    public inviteTrackerVanityInvitesCache: Collection<Snowflake, VanityInviteData> = new Collection();
    public inviteTrackerInvitesCacheUpdates: Collection<Snowflake, number> = new Collection();

    // Cache Data
    public cache: Collection<string, {}> = new Collection();

    public ExtendedClient() {
        return this;
    }

}
