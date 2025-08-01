import fs from "fs";
import path from "path";

export function getFilesRecursively(dir: string, extensions: string[]): string[] {
    if (!fs.existsSync(dir)) return [];
    let files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getFilesRecursively(fullPath, extensions));
        } else if (extensions.includes(path.extname(entry.name))) {
            files.push(fullPath);
        }
    }
    return files;
};