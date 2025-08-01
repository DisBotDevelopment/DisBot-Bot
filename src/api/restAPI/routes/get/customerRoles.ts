import {Request, Response} from "express";
import {customerDB} from "../../../../../templates/unusedModules/customer/customerDB.js";
import {ExtendedClient} from "../../../../types/client.js";

export const customerRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = req.app.get("client") as ExtendedClient;
  const id = req.params.id;
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
  const guild = await client.guilds.fetch(id);

  if (!guild) {
    res.status(404).json({ error: "Guild not found" });
    return;
  }

  res.status(200).json(guild.roles.cache.map((channel) => channel.toJSON()));
};

export const customerRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const client = req.app.get("client") as ExtendedClient;
  const id = req.params.id;
  const role = req.params.role;
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

  const guild = await client.guilds.fetch(id);

  if (!guild) {
    res.status(404).json({ error: "Guild not found" });
    return;
  }

  const roleData = guild.roles.cache.find((e) => e.id == role);

  if (!roleData) {
    res.status(404).json({ error: "Role not found" });
    return;
  }

  res.status(200).json(roleData.toJSON());
};
