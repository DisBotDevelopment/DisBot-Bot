import {handleCloseAction} from "../helper/ticketHelper.js";

export const URL_PLACEHOLDER = {
    "{twitch.url}": "https://twitch.tv/streamurl",
    "{youtube.link}": "https://youtube.com/@yourname",
    "{spotify.episode.url}": "https://open.spotify.com/episode/episodeid",
    "{spotify.show.url}": "https://open.spotify.com/show/showid"
}

export const IMAGE_PLACEHOLDER = {
    "{twitch.vod}": "https://twitch.tv/vod.png",
    "{youtube.thumbnail}": "https://youtube.com/thumbnail.png",
    "{member.avatar}": "https://i.imgur.com/kjEQRRI.png",
    "{user.avatar}": "https://cdn.xyzify.ing/u/TbZSAH.png",
    "{spotify.episode.image}": "https://cdn.xyzify.ing/u/nM7pNI.png",
    "{spotify.author.image}": "https://cdn.xyzify.ing/u/HsqWSk.png",
    "{polls.image}": "https://i.imgur.com/FHBicGA.png",
    "{welcome.image}": "https://cdn.xyzify.ing/u/e3IChB.png",
    "{level.rankCard}": "https://cdn.xyzify.ing/u/uFmQ8z.png",
    "{level.leaderboard.leaderboardImageHorizontal}": "https://cdn.xyzify.ing/u/dtKeTY.png",
    "{level.leaderboard.leaderboardImageDefault}": "https://cdn.xyzify.ing/u/aLvYLD.png",
    "{inviter.avatar}": "https://cdn.xyzify.ing/u/7cU4sY.png",
};

export const TIMESTAMP_PLACEHOLDER = {
    "{current.date}": "9250-08-04 00:00",
}

// ONLY CODE USE
const STATIC_PLACEHOLDERS: Record<string, string> = {
    ...URL_PLACEHOLDER,
    ...IMAGE_PLACEHOLDER,
    ...TIMESTAMP_PLACEHOLDER
};

// TODO: This will be used for new Modules!
export function replacePlaceholders(template: string, data: Record<string, any>): string {

    let fullPlaceholder = template.replace(/cdn\.xyzhub\.link/i, "cdn.xyzify.ing");

    for (const [key, value] of Object.entries(STATIC_PLACEHOLDERS)) {
        if (fullPlaceholder.includes(value)) {
            fullPlaceholder = fullPlaceholder.replaceAll(value, key);
        }
    }

    const newTemplate = fullPlaceholder
    return newTemplate.replace(/{([\w.]+)}/g, (match, path) => {
        const keys = path.split('.');
        let value: any = data;
        for (const key of keys) {
            if (value && typeof value == 'object' && key in value) {
                value = value[key];
            } else {
                value = "N/A";
                break;
            }
        }
        return value
    });
}
