from pulumi_gcp import storage
import pulumi_synced_folder

bucket = storage.Bucket("my-bucket", location="US")

binding = storage.BucketIAMBinding(
    "binding",
    storage.BucketIAMBindingArgs(
        bucket=bucket.name,
        role="roles/storage.objectViewer",
        members=[
            "allUsers",
        ],
    )
)

folder = pulumi_synced_folder.GoogleCloudFolder(
    "folder",
    pulumi_synced_folder.GoogleCloudFolderArgs(
        bucket_name=bucket.name,
        path="./my-folder",
        include_hidden_files=True,
    ),
)
