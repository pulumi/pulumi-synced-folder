import * as aws from "@pulumi/aws";
import * as synced from "@pulumi/synced-folder";

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: aws.s3.PublicReadAcl,
});

const folder = new synced.S3BucketFolder("synced-folder", {
    path: "./my-folder",
    bucketName: bucket.bucket,
    acl: aws.s3.PublicReadAcl,
    includeHiddenFiles: true
});
