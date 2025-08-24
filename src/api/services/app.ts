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
    const port = Config.Other.AppPort || 3000;

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
