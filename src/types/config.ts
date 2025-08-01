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
        Verification: {
            VerifyRedirectUrl: string;
            VerifyAuthUrl: string;
        };
        Bot: {
            NewsChannel1: string;
            NewsChannel2: string;
            NewsChannel3: string;
            NewsChannel4: string;
        };
        Customer: {
            PelicanApi: string;
            PelicanClientApiToken: string;
            PelicanClientApi: string;
            PelicanApplicationApi: string;
        };
        Notifications: {
            SpotifyClientId: string;
            SpotifyClientSecret: string;
            // SOON
            TiktokClientKey: string;
            TiktokClientSecret: string;
        };
    };
    Other: {
        Vote: {
            DcBotListToken: string;
            DcBotListSecret: string;
            TopggToken: string;
            VotePort: number;
        };
        AppPort: number;
        AiPort: number;
        VanityPort: number;
        EventsApi: {
            ApiKey: string;
            ApiPort: number;
        };
        WsPort: number;
        API: {
            ApiPort: number;
            ApiKey: string;
        };
    };
    Database: {
        MongodbUrl: string;
        DbName: string;
    };
    Logging: {
        BotLoggingApiPort: number;
        BotLoggingPassword: string;
        ErrorWebhook: string;
        SentryDsn: string;
        SentryAuthToken: string;
        BotLogger: string;
    };
    BotType: string;
    CONFIG_VERSION: string;
};
