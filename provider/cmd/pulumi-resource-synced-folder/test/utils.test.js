const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test, before, after } = require("node:test");

const { getFolderContents } = require("../bin/utils");

let root;
let cwd;

before(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "synced-folder-"));
    fs.mkdirSync(path.join(root, "site", "www", "sub"), { recursive: true });
    fs.writeFileSync(path.join(root, "site", "www", "index.html"), "hi");
    fs.writeFileSync(path.join(root, "site", "www", "sub", "error.html"), "oops");
    fs.writeFileSync(path.join(root, "site", "www", ".hidden"), "");
    cwd = process.cwd();
    process.chdir(path.join(root, "site"));
});

after(() => {
    process.chdir(cwd);
    fs.rmSync(root, { recursive: true, force: true });
});

function keys(folderPath, includeHiddenFiles = false) {
    return getFolderContents(folderPath, includeHiddenFiles).files.map(f => f.relativePath).sort();
}

for (const folderPath of ["www", "./www", "www/", "../site/www"]) {
    test(`keys are relative to the folder for "${folderPath}"`, () => {
        assert.deepEqual(keys(folderPath), ["index.html", "sub/error.html"]);
    });
}

test("keys are relative to the folder for an absolute path", () => {
    assert.deepEqual(keys(path.join(root, "site", "www")), ["index.html", "sub/error.html"]);
});

test("full paths point at the files", () => {
    for (const file of getFolderContents("./www").files) {
        assert.ok(fs.existsSync(file.fullPath), file.fullPath);
    }
});

test("hidden files are included only when asked for", () => {
    assert.deepEqual(keys("www", true), [".hidden", "index.html", "sub/error.html"]);
});

test("content types and last-modified time are set", () => {
    const { files, summary } = getFolderContents("www");
    assert.equal(files.find(f => f.relativePath === "index.html").contentType, "text/html");
    assert.ok(summary.lastModified > 0);
});

test("a missing folder has no files", () => {
    assert.deepEqual(getFolderContents("nope").files, []);
});
