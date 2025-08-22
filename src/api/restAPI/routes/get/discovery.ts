import {database} from "../../../../main/database.js";
import {Request, Response} from "express";
import {ExtendedClient} from "../../../../types/client.js";

const bannedWords = [
    "hitler", "heil", "nazi", "fascist", "racist", "slavery", "genocide", "holocaust", "ss",
    "nigger", "negro", "coon", "chink", "spic", "kike", "paki", "gook", "faggot", "tranny", "dyke",
    "retard", "cripple", "mong", "gypsy", "towelhead", "raghead", "sandnigger", "white trash",
    "fuck", "shit", "bitch", "cunt", "asshole", "dick", "cock", "pussy", "slut", "whore", "bastard",
    "motherfucker", "dumbass", "jackass", "douchebag", "prick", "bollocks", "wanker", "twat",
    "kys", "suicide", "hang yourself", "cut yourself", "kill yourself", "die", "murder",
    "massacre", "shoot yourself", "jump off", "overdose", "self harm", "gas yourself",
    "rape", "rapist", "molest", "incest", "child porn", "cp", "bestiality", "zoophile",
    "pedophile", "pedo", "groomer", "porn", "pornhub", "xvideos", "xnxx", "redtube",
    "anal", "oral", "cum", "semen", "clit", "dildo", "vibrator", "boobs", "tits", "fisting",
    "handjob", "blowjob", "gangbang", "deepthroat", "bukkake", "stripper", "escort",
    "drug", "weed", "cocaine", "crack", "heroin", "meth", "lsd", "ecstasy", "molly", "ketamine",
    "addict", "stoner", "junkie", "overdose", "cartel", "dealer", "smack",
    "terrorist", "isis", "al qaeda", "taliban", "jihad", "bomber", "bombing",
    "school shooter", "mass shooting", "columbine", "9/11", "beheading", "execute",
    "slave", "whip", "lynch", "burn", "hang", "torture", "blood", "gore", "snuff", "kill",
    "sodomize", "necrophilia", "beastiality", "zoophilia", "pedo shit", "pedo scum"
]


function validateContent(text?: string): boolean {
    if (!text) return true;
    const lower = text.toLowerCase();
    return !bannedWords.some((w) => lower.includes(w));
}

export const discoveryApi = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const client = req.app.get("client") as ExtendedClient;
        const dData = await database.vanitys.findMany({
            include: {
                Embed: {
                    include: {
                        Author: true
                    }
                }
            },
            where: {
                InDiscovery: true,
                IsBannedFromDiscover: false
            }
        });

        if (dData.length === 0) {
            res.status(404).json({
                success: false,
                error: "No discovery data"
            });
            return;
        }

        // Daten + Validation
        const data = dData
            .map((s) => {
                return {
                    UUID: s.UUID,
                    Slug: s.Slug,
                    Host: s.Host,
                    GuildId: s.GuildId,
                    Invite: s.Invite,
                    InDiscovery: s.InDiscovery,
                    Embed: s.Embed,
                    UserId: s.UserId,
                    MemberCount: client.guilds.cache.get(s.GuildId)?.memberCount ?? 0
                };
            })
            // Filter: nur Server erlauben, die keine Hass-Sachen enthalten
            .filter((s) => {
                return (
                    validateContent(s.Slug) &&
                    validateContent(s.Embed?.Title) &&
                    validateContent(s.Embed?.Description) &&
                    validateContent(s.Embed?.Author?.Name)
                );
            });

        if (data.length === 0) {
            res.status(403).json({
                success: false,
                error: "All discovery entries contained blocked content"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
