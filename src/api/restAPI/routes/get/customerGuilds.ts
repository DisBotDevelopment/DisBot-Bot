import {Request, Response} from "express";
import {customerDB} from "../../../../../templates/unusedModules/customer/customerDB.js";
import {ExtendedClient} from "../../../../types/client.js";

export const customerGuilds = async (
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
  const guilds = client.guilds.cache.map((guild) => guild.toJSON());

  res.status(200).json({
    guilds: guilds,
  });
};

export const customerGuild = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = req.app.get("client") as ExtendedClient;
  const guild = client.guilds.cache.get(req.params.id);
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

  if (!guild) {
    res.status(404).json({
      error: "The guild was not found",
    });
    return;
  }

  res.status(200).json(guild.toJSON());
};
