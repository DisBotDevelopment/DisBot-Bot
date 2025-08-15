import YAML from "yaml";
import fs from "fs";
import {botData} from "./version.js";
import colors from "colors";
import {DisBotConfigData} from "../types/config.js";

colors.enable();

export let Config: DisBotConfigData

export async function configStartup() {
    const fileCheck = fs.existsSync(process.env.CONFIG_PATH);
    let content: string
    if (fileCheck) {
        const fileContent = fs.readFileSync(process.env.CONFIG_PATH);
        content = fileContent.toString();
    }
    if (!fileCheck || !content) {
        const configData: DisBotConfigData = {
            Bot: {
                DiscordBotToken: "",
                DiscordApplicationId: "",
                DiscordClientSecret: "",
                AdminGuildId: "",
                ShardCount: 0,
                ShardList: "",
            },
            Modules: {
                Verification: {
                    VerifyRedirectUrl: "",
                    VerifyAuthUrl: "",
                },
                Bot: {
                    NewsChannel1: "",
                    NewsChannel2: "",
                    NewsChannel3: "",
                    NewsChannel4: "",
                },
                Customer: {
                    PelicanApi: "",
                    PelicanClientApiToken: "",
                    PelicanClientApi: "",
                    PelicanApplicationApi: "",
                },
                Notifications: {
                    SpotifyClientId: "",
                    SpotifyClientSecret: "",
                    TiktokClientKey: "",
                    TiktokClientSecret: "",
                },
            },
            Other: {
                Vote: {
                    DcBotListToken: "",
                    DcBotListSecret: "",
                    TopggToken: "",
                    VotePort: 0,
                },
                AppPort: 0,
                AiPort: 0,
                VanityPort: 0,
                EventsApi: {
                    ApiKey: "",
                    ApiPort: 0,
                    WsPort: 0,
                },
                API: {
                    ApiPort: 0,
                    ApiKey: "",
                },
            },
            Logging: {
                ErrorWebhook: "",
                BotLogger: "",
            },
            BotType: "",
            CONFIG_VERSION: botData.configVersion,
        };

        const doc = new YAML.Document();
        doc.contents = configData as any;

        doc.commentBefore = ` DisBot Config v${botData.configVersion} of version ${botData.version}\n Read more: https://doc.xyzhub.link/s/disbot/doc/config-yXEob11woF`;

        fs.writeFileSync(
            process.env.CONFIG_PATH,
            YAML.stringify(doc)
        );
    }

    const file = fs.readFileSync(process.env.CONFIG_PATH, "utf8");
    const ymlData = YAML.parse(file);
    Config = ymlData;

    console.log("DisBot Config is loaded and exported! (Logger, Startup, Bot)")

    if (Config.CONFIG_VERSION != botData.configVersion) {
        console.error(`Please recreate your Bot Config`.red)
        process.exit(0);
    }
}