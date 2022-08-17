import * as fs from "fs";
import * as glob from "glob";
import * as mime from "mime";

interface FolderContents {
    summary: {
        lastModified: number;
    }
    files: {
        fullPath: string;
        relativePath: string;
        contentType: string;
    }[],
}

export function getFolderContents(path: string): FolderContents {
    const folderPath = path;
    const contents = glob.sync(`${folderPath}/**/*`, { nodir: true });

    const files = contents.map(fullPath => {
        const relativePath = fullPath.replace(`${folderPath}/`, "");
        return {
            fullPath,
            relativePath,
            contentType: mime.getType(fullPath) || "text/plain",
        }
    });

    const summary = {
        lastModified: contents.reduce((latest, file) => Math.max(latest, fs.statSync(file).mtimeMs), 0),
    };

    return {
        summary,
        files,
    };
} 
