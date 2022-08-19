"""An example of using the synced-folder component."""

import pulumi
from pulumi_aws import s3
import pulumi_synced_folder

bucket = s3.Bucket("s3-bucket", acl="public-read", 
    website=s3.BucketWebsiteArgs(
        index_document="index.html",
        error_document="error.html"
    )
)

folder = pulumi_synced_folder.S3BucketFolder("synced-bucket-folder", 
    path="./site",
    bucket_name=bucket.bucket,
    acl="public-read",
    managed_objects=False
)

pulumi.export("url", pulumi.Output.concat("http://", bucket.website_endpoint))
