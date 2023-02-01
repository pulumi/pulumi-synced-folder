import * as gcp from "@pulumi/gcp";
import * as synced from "@pulumi/synced-folder";

const bucket = new gcp.storage.Bucket("my-bucket", {
    location: "US"
});

const binding = new gcp.storage.BucketIAMBinding("binding", {
    bucket: bucket.name,
    role: "roles/storage.objectViewer",
    members: [
        "allUsers"
    ],
});

const folder = new synced.GoogleCloudFolder("folder", {
    bucketName: bucket.name,
    path: "./my-folder",
    includeHiddenFiles: true
});
