import express from "express";
import path from "path"
import {ExtendedClient} from "../../types/client.js";
import {secureHeapUsed} from "crypto";
import {VerificationAction, VerificationActionType} from "../../enums/verification.js";
import {GuildChannel} from "discord.js";
import {Logger} from "../../main/logger.js";
import {LoggingAction} from "../../enums/loggingTypes.js";
import {database} from "../../main/database.js";
import {Config} from "../../main/config.js";

export async function app(client: ExtendedClient) {
    const app = express();
    const port = Config.Other.API.ApiPort || 3000;

    app.set("view engine", "ejs");
    app.use(express.static(`${process.cwd()}/src/api/public`));

    // Routes
    app.get("/", (req, res) => {
        res.status(200).json({
            message: "Welcome to DisBot App Service",
            version: "0.1.0",
            discord: "https://disbot.app/discord",
            status: 200,
        });
    });

    app.get("/verify/callback", async (req, res) => {

        const {code} = req.query;

        if (!code) {
            res.status(400).json({error: "Code query parameter is required"});
        }

        const dcData = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: Config.Bot.DiscordApplicationId || "",
                client_secret: Config.Bot.DiscordClientSecret || "",
                grant_type: "authorization_code",
                scope: "identify",
                code: code as string,
                redirect_uri: Config.Modules.Verification.VerifyRedirectUrl || "",
            }),
        });

        const dcDataJson = await dcData.json() as any

        if (dcDataJson?.error) {
            res.status(400).json({error: dcDataJson.error_description});
            return
        }

        const state = req.query.state as string;

        if (!state) {
            res.status(400).json({error: "State query parameter is required"});
            return
        }

        const gate = await database.verificationGates.findFirst({
            include: {
                ChannelPermissions: true
            },
            where: {
                UUID: state
            }
        })

        if (!gate) {
            res.status(404).json({error: "Verification gate not found"});
            return
        }

        const userData = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${dcDataJson.access_token}`,
                "Content-Type": "application/json",
            },
        });

        const userDataJson = await userData.json() as any;

        const user = client.users.cache.get(userDataJson.id);
        if (!user) {
            res.status(404).json({error: "User not found"});
            return
        }

        const guild = client.guilds.cache.get(gate.SecurityId as string);
        if (!guild) {
            res.status(404).json({error: "Guild not found"});
            return
        }

        if (gate.ActionType != VerificationActionType.Authorize) {
            res.status(400).json({error: "Invalid action type for verification gate"});
            return
        }

        if (gate.Action === VerificationAction.AddRole && gate.ActionType === VerificationActionType.Authorize) {

            if (!gate.Roles || gate.Roles.length === 0) {
                res.status(400).json({error: "No roles specified in the gate"});
                return
            }

            if (gate.VerifiedUsers.includes(user.id)) {
                res.status(400).json({error: "User already verified"});
                return
            }

            const guildMemeber = await guild.members.fetch(user.id).catch(() => null);
            if (!guildMemeber) {
                res.status(404).json({error: "Member not found in guild"});
                return
            }
            for (const roleId of gate.Roles) {
                const role = guild.roles.cache.get(roleId);
                if (!role) {
                    res.status(404).json({error: `Role with ID ${roleId} not found`});
                    return
                }
                await guildMemeber.roles.add(role).catch(() => null);
            }
            gate.VerifiedUsers.push(user.id);
            await database.verificationGates.update({
                where: {UUID: gate.UUID},
                data: {VerifiedUsers: gate.VerifiedUsers},
            });
        } else if (gate.Action === VerificationAction.AddPermissionToChannel && gate.ActionType === VerificationActionType.Authorize) {

            const guild = client.guilds.cache.get(gate.SecurityId as string);
            if (!guild) {
                res.status(404).json({error: "Guild not found"});
                return
            }
            if (!gate.ChannelPermissions || gate.ChannelPermissions.length === 0) {
                res.status(400).json({error: "No permissions specified in the gate"});
                return
            }

            if (gate.VerifiedUsers.includes(user.id)) {
                res.status(400).json({error: "User already verified"});
                return
            }
            const guildMemeber = await guild.members.fetch(user.id).catch(() => null);
            if (!guildMemeber) {
                res.status(404).json({error: "Member not found in guild"});
                return
            }
            for (const permission of gate.ChannelPermissions) {
                const channel = guild.channels.cache.get(permission.ChannelId);
                if (!channel) {
                    res.status(404).json({error: `Channel with ID ${permission.ChannelId} not found`});
                    return
                }
                await (channel as GuildChannel).permissionOverwrites.create(guildMemeber, {
                    [String(permission.Permission)]: true,
                }).catch(() => null);
            }
            gate.VerifiedUsers.push(user.id);
            await database.verificationGates.update({
                where: {UUID: gate.UUID},
                data: {VerifiedUsers: gate.VerifiedUsers},
            });
        }


        return res
            .status(200)
            .render(path.join(process.cwd(), "src", "api", "public", "html", "verify.ejs"))
    })

    app.get("/transscripts", async (req, res) => {
            res
                .status(200)
                .render("")
        }
    )

    app.get("/transscripts/:uuid", async (req, res) => {
        try {
            const data = await database.tickets.findFirst({
                where: {
                    TicketId: req.params.uuid
                }
            });
            if (data && data.id === req.params.uuid) {
                res.status(200).send(`${data.TranscriptHTML}`);
            } else {
                res
                    .status(200)
                    .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error",
            });
        }
    });

    app.get("/embeds", async (req, res) => {

        res
            .status(200)
            .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
    });

    app.get("/embeds/:uuid", async (req, res) => {
        try {
            const data = await database.messageTemplates.findFirst({
                where: {
                    Name: req.params.uuid
                }
            });
            if (data && data.Name === req.params.uuid) {
                res.status(200).send(
                    `
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.Name} Embed</title>
  <link href="https://silicon-css.com/silicon.min.css" rel="stylesheet" />
  <style>
    #code {
      width: 600px;
      height: 300px;
      resize: none; /* verhindert das Ändern der Größe */
    }
  </style>
</head>
<body>
  <h1>${data.Name}</h1>

  <textarea 
    width: 50000px;
    height: 500px;
    id="code">${data.EmbedJSON ? data.EmbedJSON : "This Message Template has no Embed!"
                    }</textarea>
  <br /><br /><br />
  <button onclick="copy()">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: "
    >
      <path
        d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
      ></path>
      <path
        d="M4 22h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2zm2-10h6v2H6v-2zm0 4h6v2H6v-2z"
      ></path>
    </svg>
  </button>
  <button onclick="share()">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style="fill: rgba(255, 255, 255, 1); transform: ; msfilter: "
    >
      <path
        d="M11 6.914V2.586L6.293 7.293l-3.774 3.774 3.841 3.201L11 18.135V13.9c8.146-.614 11 4.1 11 4.1 0-2.937-.242-5.985-2.551-8.293C16.765 7.022 12.878 6.832 11 6.914z"
      ></path>
    </svg>
  </button>

  <script>
    function copy() {
      navigator.clipboard.writeText(
        document.getElementById("code").value
      );
    }

    function share() {
      navigator.clipboard.writeText(
        "https://app.disbot.app/embeds/${data.Name}"
      );
    }
  </script>
</body>
</html>
`
                );
            } else {

                res
                    .status(200)
                    .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error",
            });
        }
    });

    app.get("/tickets/buttons", async (req, res) => {

        res
            .status(200)
            .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
    });
    app.get("/tickets/menus", async (req, res) => {

        res
            .status(200)
            .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
    });

    app.get("/tickets/menus/:uuid", async (req, res) => {
        try {
            const data = await database.ticketSetups.findFirst({where: {CustomId: req.params.uuid}});
            if (data && data.CustomId === req.params.uuid) {
                const guild = client.guilds.cache.get(data.GuildId as string);
                if (!guild) res.status(404).json({error: "Guild not found"});

                res.status(200).send(`SOON`);
            } else {

                res
                    .status(200)
                    .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error",
            });
        }
    });

    app.get("/tickets/buttons/:uuid", async (req, res) => {
        try {
            const data = await database.ticketSetups.findFirst({
                where: {
                    CustomId: req.params.uuid
                }
            });
            if (data && data.CustomId === req.params.uuid) {
                const guild = client.guilds.cache.get(data.GuildId as string);
                const role = guild?.roles.cache.get(data.Handlers[0] as string);

                const transcripts = guild?.channels.cache.get(
                    data.TranscriptChannelId as string
                );

                res.status(200).send(`SOON`);
            } else {
                res
                    .status(200)
                    .sendFile(path.join(process.cwd(), "src", "api", "public", "html", "404.html"))
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server Error",
            });
        }
    });

    app.listen(port, () => {
        Logger.info(
            {
                timestamp: new Date().toISOString(),
                level: "info",
                label: "AppService",
                message: `App Service is running on port ${port}`,
                botType: Config.BotType.toString() || "Unknown",
                action: LoggingAction.Other,
            }
        );
    });
}
