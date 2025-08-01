import axios from "axios";
import {ActivityType, Base64Resolvable, PresenceStatusData, User,} from "discord.js";
import {Request, Response} from "express";
import {customerDB} from "../../../../../templates/unusedModules/customer/customerDB.js";
import {ExtendedClient} from "../../../../types/client.js";
import {Config} from "../../../../main/config.js";

export const customerProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const client = req.app.get("client") as ExtendedClient;
    const userID = req.app.get("user") as string;
    const customerID = req.params.customer;

    if (
        client.user?.id == "1063079377975377960" ||
        client.user?.id == "1154097245105422427"
    ) {
        res.status(404).json({
            error: "DisBot not support the Customer API get the Customer API URL!",
        });
        req.app.set("user", undefined);
        return;
    }

    if (userID != undefined) {
        const customer = await customerDB.findOne({
            UserID: userID,
            Application: customerID,
        });

        var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        if (customer?.ServerPort !== fullUrl.split(":")[2].split("/")[0]) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }

        if (!customer) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }
    }
    req.app.set("user", undefined);

    const data = await customerDB.findOne({
        Application: customerID,
    });

    if (!data) {
        res.status(404).json({error: "Application not found"});
        return;
    }

    const banner = await axios.get(`https://discord.com/api/v10/users/@me`, {
        headers: {
            Authorization: `Bot ${Config.Bot.DiscordBotToken}`,
        },
    });

    const user = banner.data as User;

    try {
        res.status(200).json({
            data: data,
            Token: Config.Bot.DiscordBotToken,
            Name: client.user?.username,
            Avatar: client.user?.avatarURL(),
            Banner: `https://cdn.discordapp.com/banners/${client.user?.id}/${user.banner}.webp`,
        });
    } catch (e) {
        res.status(500).json({error: e});
    }
};

export const customerAvatar = async (
    req: Request,
    res: Response
): Promise<void> => {
    const client = req.app.get("client") as ExtendedClient;
    const avatarUrl = req.body.avatar;
    const userID = req.app.get("user") as string;
    const customerID = req.params.customer;

    if (
        client.user?.id == "1063079377975377960" ||
        client.user?.id == "1154097245105422427"
    ) {
        res.status(404).json({
            error: "DisBot not support the Customer API get the Customer API URL!",
        });
        req.app.set("user", undefined);
        return;
    }

    if (userID != undefined) {
        const customer = await customerDB.findOne({
            UserID: userID,
            Application: customerID,
        });

        var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        if (customer?.ServerPort !== fullUrl.split(":")[2].split("/")[0]) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }

        if (!customer) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }
    }
    req.app.set("user", undefined);

    if (!avatarUrl) {
        res.status(400).json({error: "Avatar URL is required"});
    }

    try {
        const customerData = await customerDB.findOne({
            Application: customerID,
        });
        if (!customerData) {
            res.status(404).json({error: "Application not found"});
        }

        const image = await axios.get(avatarUrl, {
            responseType: "arraybuffer",
        });

        const base64String = Buffer.from(image.data).toString("base64");

        if (client.user && typeof client.user?.setAvatar === "function") {
            const result = await client.user?.setAvatar(
                `data:image/${image.headers["content-type"]};base64,${base64String}` as Base64Resolvable
            );
            res.status(200).json({message: "Avatar updated successfully", result});
        } else {
            res.status(500).json({
                error: "Client user is not available or setAvatar is not a function",
            });
        }
    } catch (error) {
        console.error("Error setting avatar:", error);

        if (error) {
            res.status(400).json({
                error: "Failed to fetch avatar from the URL",
                details: error,
            });
        }

        res.status(500).json({error: "Internal server error", details: error});
    }
};

export const customerBanner = async (
    req: Request,
    res: Response
): Promise<void> => {
    const client = req.app.get("client") as ExtendedClient;

    const bannerUrl = req.body.banner;
    const userID = req.app.get("user") as string;
    const customerID = req.params.customer;

    if (
        client.user?.id == "1063079377975377960" ||
        client.user?.id == "1154097245105422427"
    ) {
        res.status(404).json({
            error: "DisBot not support the Customer API get the Customer API URL!",
        });
        req.app.set("user", undefined);
        return;
    }

    if (userID != undefined) {
        const customer = await customerDB.findOne({
            UserID: userID,
            Application: customerID,
        });

        var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        if (customer?.ServerPort !== fullUrl.split(":")[2].split("/")[0]) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }

        if (!customer) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }
    }
    req.app.set("user", undefined);

    if (!bannerUrl) {
        res.status(400).json({error: "Banner URL is required"});
    }

    try {
        const customerData = await customerDB.findOne({
            APIServerlication: customerID,
        });
        if (!customerData) {
            res.status(404).json({error: "APIServerlication not found"});
        }

        const image = await axios.get(bannerUrl, {
            responseType: "arraybuffer",
        });

        const base64String = Buffer.from(image.data).toString("base64");

        if (client.user && typeof client.user.setBanner === "function") {
            const result = await client.user.setBanner(
                `data:image/${image.headers["content-type"]};base64,${base64String}` as Base64Resolvable
            );
            res.status(200).json({message: "Banner updated successfully", result});
        } else {
            res.status(500).json({
                error: "Client user is not available or setBanner is not a function",
            });
        }
    } catch (error) {
        console.error("Error setting banner:", error);

        if (error) {
            res.status(400).json({
                error: "Failed to fetch banner from the URL",
                details: error,
            });
        }

        res.status(500).json({error: "Internal server error", details: error});
    }
};

export const customername = async (
    req: Request,
    res: Response
): Promise<void> => {
    const client = req.app.get("client") as ExtendedClient;

    const name = req.body.name;
    const userID = req.app.get("user") as string;
    const customerID = req.params.customer;

    if (
        client.user?.id == "1063079377975377960" ||
        client.user?.id == "1154097245105422427"
    ) {
        res.status(404).json({
            error: "DisBot not support the Customer API get the Customer API URL!",
        });
        req.app.set("user", undefined);
        return;
    }

    if (userID != undefined) {
        const customer = await customerDB.findOne({
            UserID: userID,
            Application: customerID,
        });

        var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        if (customer?.ServerPort !== fullUrl.split(":")[2].split("/")[0]) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }

        if (!customer) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }
    }
    req.app.set("user", undefined);

    if (!name) {
        res.status(400).json({error: "Name is required"});
    }

    try {
        const customerData = await customerDB.findOne({
            APIServerlication: customerID,
        });
        if (!customerData) {
            res.status(404).json({error: "APIServerlication not found"});
        }

        if (client.user && typeof client.user.setUsername === "function") {
            const result = await client.user.setUsername(name);
            res.status(200).json({message: "Name updated successfully", result});
        } else {
            res.status(500).json({
                error: "Client user is not available or setUsername is not a function",
            });
        }
    } catch (error) {
        console.error("Error setting name:", error);

        if (error) {
            res.status(400).json({
                error: "Failed to set name",
                details: error,
            });
        }

        res.status(500).json({error: "Internal server error", details: error});
    }
};

export const customerStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    const client = req.app.get("client") as ExtendedClient;

    const text = req.body.text;
    const status = req.body.status;
    const link = req.body.url;
    const type = req.body.type;
    const userID = req.app.get("user") as string;
    const customerID = req.params.customer;

    if (
        client.user?.id == "1063079377975377960" ||
        client.user?.id == "1154097245105422427"
    ) {
        res.status(404).json({
            error: "DisBot not support the Customer API get the Customer API URL!",
        });
        req.app.set("user", undefined);
        return;
    }

    if (userID != undefined) {
        const customer = await customerDB.findOne({
            UserID: userID,
            Application: customerID,
        });

        var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        if (customer?.ServerPort !== fullUrl.split(":")[2].split("/")[0]) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }

        if (!customer) {
            res.status(404).json({
                error: "The customer was not found or not the owner of the customer",
            });
            req.app.set("user", undefined);
            return;
        }
    }
    req.app.set("user", undefined);

    const data = await customerDB.findOne({
        Application: customerID,
    });

    if (!data) {
        res.status(404).json({error: "APIServerlication not found"});
        return;
    }

    try {
        await customerDB.findOneAndUpdate(
            {Application: customerID},
            {
                BotStatus: {
                    Type: type,
                    Text: text,
                    Status: status,
                    URL: link,
                },
            }
        );

        if (link) {
            client.user?.presence.set({
                status: status as PresenceStatusData,
                activities: [
                    {
                        name: text as string,
                        type: type as ActivityType,
                        url: link as string,
                    },
                ],
            });
        } else {
            client.user?.presence.set({
                status: status as PresenceStatusData,
                activities: [
                    {
                        name: text as string,
                        type: type as ActivityType,
                    },
                ],
            });
        }

        res.status(200).json({message: "Status set"});
    } catch (e) {
        res.status(500).json({error: e});
    }
};
