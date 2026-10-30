import * as fs from "fs";
import * as glob from "glob";
import * as mime from "mime";
import * as path from "path";

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

export function getFolderContents(folderPath: string, includeHiddenFiles: boolean=false): FolderContents {
    // Relative to the folder, so keys never include its path (`./www`, `../site`), and with `/` on Windows.
    const relativePaths = glob.sync("**/*", { cwd: folderPath, nodir: true, dot: includeHiddenFiles, posix: true });

    const files = relativePaths.map(relativePath => {
        const fullPath = path.join(folderPath, relativePath);
        return {
            fullPath,
            relativePath,
            contentType: mime.getType(fullPath) || "text/plain",
        }
    });

    const summary = {
        lastModified: files.reduce((latest, file) => Math.max(latest, fs.statSync(file.fullPath).mtimeMs), 0),
    };

    return {
        summary,
        files,
    };
} 
