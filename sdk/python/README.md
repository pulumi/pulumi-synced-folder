# synced-folder

Synchronizes a local folder to Amazon S3, Azure Blob Storage, or Google Cloud Storage.

Still very much 🚧 👷. 

## Usage 

```yaml
name: synced-folder-example-yaml
runtime: yaml
description: An example of using the synced-folder component in YAML.

resources:

  my-bucket:
    type: aws:s3:Bucket
    properties:
      acl: public-read
      forceDestroy: true
      website:
        indexDocument: index.html
        errorDocument: error.html

  my-synced-folder:
    type: synced-folder:index:S3BucketFolder
    properties:
      path: ./site
      bucketName: ${my-bucket.bucket}
      acl: ${my-bucket.acl}
      manageObjects: false # The default, which manages objects as aws.s3.BucketObjects. When false, files are synced with aws s3 sync.

outputs:
  url: http://${my-bucket.websiteEndpoint}
```

```typescript
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

```
