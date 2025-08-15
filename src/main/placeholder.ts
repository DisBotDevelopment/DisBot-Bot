export const URL_PLACEHOLDER = {
    "{stream.url}": "https://twitch.tv/streamurl",
    "{link}": "https://youtube.com/@yourname",
    "{spotify.episode.url}": "https://open.spotify.com/episode/episodeid",
    "{spotify.show.url}": "https://open.spotify.com/show/showid"
}

export const IMAGE_PLACEHOLDER = {
    "{member.avatar}": "https://i.imgur.com/kjEQRRI.png",
    "{spotify.episode.image}": "https://cdn.xyzhub.link/u/nM7pNI.png",
    "{spotify.author.image}": "https://cdn.xyzhub.link/u/HsqWSk.png",
    "{inviter.avatar}": "https://i.imgur.com/kjEQRRI.png"
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

    let fullPlaceholder = template;

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
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                value = "N/A";
                break;
            }
        }
        return value
    });
}
