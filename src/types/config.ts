import {BotType} from "enums/botType.js";

export type DisBotConfigData = {
    Bot: {
        DiscordBotToken: string;
        DiscordApplicationId: string;
        DiscordClientSecret: string;
        AdminGuildId: string;
        ShardCount: number;
        ShardList: string;
    };
    Modules: {
        Vanity: {
            VanityPort: number;
            MainPageRedirect: string | "https://disbot.app/discovery";
        }
        Verification: {
            VerifyRedirectUrl: string;
            VerifyAuthUrl: string;
        };
        Notifications: {
            SpotifyClientId: string;
            SpotifyClientSecret: string;
            TwitchClientId: string;
            TwitchClientSecret: string;
            // SOON
            TiktokClientKey: string;
            TiktokClientSecret: string;
        };
    };
    Other: {
        CDN: {
            Url: string;
            APIToken: string;
        }
        Vote: {
            DcBotListToken: string;
            DcBotListSecret: string;
            TopggToken: string;
            VotePort: number;
            VoteRoleId: string;
            VoteGuildId: string;
        };
        AppPort: number;
        API: {
            ApiPort: number;
            ApiKey: string;
        };
    };
    Logging: {
        ErrorWebhook: string;
        BotLogger: string;
        GitHubAPIToken: string;
    };
    BotType: string;
    CONFIG_VERSION: string
};
