import {Request, Response} from "express";
import {ExtendedClient} from "../../../../types/ExtendedClient.js";
import {database} from "../../../../main/database.js";
import {Config} from "../../../../main/config.js";

export const banList = async (
    req: Request,
    res: Response
): Promise<void> => {
    const data = await database.moderationScout.findFirst({
        where: {
            GuildId: Config.Modules.Moderation.Scout.BanListAdminGuildId
        }
    })

    res.json(data?.AdminBanList ?? [])
};

