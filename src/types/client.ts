import { Client, Collection, type Snowflake } from "discord.js";
import { Ollama } from "ollama";
import { TrackedInviteData, VanityInviteData } from "../systems/inviteTracker/inviteTrackerTypes.js";
import { DisBotInteraction } from "./interaction.js";
import { Logger } from "../main/logger.js";
import { PrismaClient } from "prisma/index.js";

export interface ExtendedClient extends Client {
    filters: Collection<string, any>;
    commands?: Collection<string, DisBotInteraction>;
    subCommands?: Collection<string, DisBotInteraction>;
    guildCommands?: Collection<string, DisBotInteraction>;
    guildSubCommands?: Collection<string, DisBotInteraction>;
    subCommandGroups?: Collection<string, DisBotInteraction>;
    buttons?: Collection<string, DisBotInteraction>;
    selectmenus?: Collection<string, DisBotInteraction>;
    modals?: Collection<string, DisBotInteraction>;
    events?: Collection<string, DisBotInteraction>;
    cooldowns?: Collection<any, any>;
    aiAPI?: Ollama;
    defaultEmbedColor: "#2B2D31";
    cache: Collection<string, {}>;
    inviteTracker: {
        invitesCache: Collection<Snowflake, Collection<string, TrackedInviteData>>;
        vanityInvitesCache: Collection<Snowflake, VanityInviteData>;
        invitesCacheUpdates: Collection<Snowflake, number>;
    }
    logger: typeof Logger,
}
