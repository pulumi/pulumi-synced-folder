from pulumi_aws import s3
import pulumi_synced_folder

bucket = s3.Bucket(
    "my-bucket",
    acl=s3.CannedAcl.PUBLIC_READ,
)

folder = pulumi_synced_folder.S3BucketFolder(
    "synced-folder",
    path="./my-folder",
    bucket_name=bucket.bucket,
    acl=s3.CannedAcl.PUBLIC_READ,
)
