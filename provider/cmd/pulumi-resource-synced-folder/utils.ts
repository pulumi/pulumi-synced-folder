import * as glob from "glob";
import * as mime from "mime";

export function getFiles(path: string): { fullPath: string, relativePath: string, mimeType: string }[] {
    const folderPath = path;
    const files = glob.sync(`${folderPath}/**/*`, { nodir: true });

    return files.map(fullPath => {
        const relativePath = fullPath.replace(`${folderPath}/`, "");
        return {
            fullPath,
            relativePath,
            mimeType: mime.getType(fullPath) || "text/plain",
        }
    });
} 
