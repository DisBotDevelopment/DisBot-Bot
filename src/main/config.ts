import * as YAML from "yaml";
import fs from "fs";
import {botData} from "./version.js";
import colors from "colors";
import {DisBotConfigData} from "../types/config.js";
import {YAMLMap} from "yaml";

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
                Vanity: {
                    MainPageRedirect: "https://disbot.app/discovery",
                    VanityPort: 0
                },
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
                    TwitchClientId: "",
                    TwitchClientSecret: "",
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
            BotType: "DISBOT",
            CONFIG_VERSION: botData.configVersion,
        };


        const doc = new YAML.Document(configData);

        doc.commentBefore = ` DisBot Config v${botData.configVersion} of version ${botData.version}\n Read more: https://doc.xyzhub.link/s/disbot/doc/config-yXEob11woF`;

        generateConfigCommentIn(doc, ["Bot", "DiscordBotToken"], " Discord Bot Token from https://discord.com/developers/applications/<bot-id>/bot")
        generateConfigCommentIn(doc, ["Bot", "DiscordApplicationId"], " Discord Bot Token from https://discord.com/developers/applications/<bot-id>/information")
        generateConfigCommentIn(doc, ["Bot", "DiscordClientSecret"], " Discord Bot Token from https://discord.com/developers/applications/<bot-id>/oauth2")
        generateConfigCommentIn(doc, ["Bot", "AdminGuildId"], " Bot Admin Guild for Internal Commands (https://github.com/DisBotDevelopment/DisBot-Bot/tree/main/src/internal)")
        generateConfigCommentIn(doc, ["Bot", "ShardCount"], " Use this only if you know what you are doing")
        generateConfigCommentIn(doc, ["Modules", "Verification", "VerifyRedirectUrl"], " Redirect from the Auth")
        generateConfigCommentIn(doc, ["Modules", "Verification", "VerifyAuthUrl"], " Discord Auth Url from the https://discord.com/developers/applications/<bot-id>/oauth2 Portal")
        generateConfigCommentIn(doc, ["Modules", "Bot", "NewsChannel1"], " Only for DisBots Discord Server as Info Channel")
        generateConfigCommentIn(doc, ["Modules", "Customer", "PelicanApi"], " Currently in Development and not inclued in the Bot (CODE: https://github.com/DisBotDevelopment/DisBot-Bot/tree/main/templates/unusedModules/customer)")
        generateConfigCommentIn(doc, ["Modules", "Notifications", "SpotifyClientId"], " Auth for your notifications")
        generateConfigCommentIn(doc, ["Modules", "Vanity", "VanityPort"], " Port for the Redirect of the vanity.")
        generateConfigCommentIn(doc, ["Modules", "Vanity", "MainPageRedirect"], " Main Page Redirect to any site (dchat.link -> https://google.com)")

        generateConfigComment(doc, "Other", " Internal use and currently in rework (API Update)")
        generateConfigCommentBefore(doc, "Logging", " DisBot Logs and Debug Logging (Webhook)")
        generateConfigComment(doc, "BotType", " Internal use for loading services. (Use DISBOT)")
        generateConfigComment(doc, "CONFIG_VERSION", " Used for updates in the Config.")

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

function generateConfigCommentIn(yamlDocument: YAML.Document, path: string[], comment: string) {
    const node = yamlDocument.getIn(path, true) as YAMLMap;
    node.comment = comment;
}

function generateConfigComment(yamlDocument: YAML.Document, key: string, comment: string) {
    const node = yamlDocument.get(key, true) as YAMLMap;
    node.comment = comment
}

function generateConfigCommentBeforeIn(yamlDocument: YAML.Document, path: string[], comment: string) {
    const node = yamlDocument.getIn(path, true) as YAMLMap;
    node.commentBefore = comment;
}

function generateConfigCommentBefore(yamlDocument: YAML.Document, key: string, comment: string) {
    const node = yamlDocument.get(key, true) as YAMLMap;
    node.commentBefore = comment
}