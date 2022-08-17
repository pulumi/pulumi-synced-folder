import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced from "@pulumi/synced-folder";

const myS3Bucket = new aws.s3.Bucket("s3-bucket", {
    acl: "public-read",
    forceDestroy: true,
    website: {
        indexDocument: "index.html",
        errorDocument: "error.html",
    },
});

const s3Folder = new synced.S3BucketFolder("s3-folder", {
    path: "./site",
    bucketName: myS3Bucket.bucket,
    acl: "public-read",
    manageObjects: false,
});

export const url = pulumi.interpolate`http://${myS3Bucket.websiteEndpoint}`;
