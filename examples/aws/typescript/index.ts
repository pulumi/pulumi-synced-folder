import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced from "@pulumi/synced-folder";

const bucket = new aws.s3.Bucket("s3-bucket", {
    acl: aws.s3.PublicReadAcl,
    website: {
        indexDocument: "index.html",
        errorDocument: "error.html",
    },
});

const folder = new synced.S3BucketFolder("synced-bucket-folder", {
    path: "./site",
    bucketName: bucket.bucket,
    acl: aws.s3.PublicReadAcl,
    managedObjects: false,
});

export const url = pulumi.interpolate`http://${bucket.websiteEndpoint}`;
