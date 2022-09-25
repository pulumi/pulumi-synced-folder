using Pulumi;
using Pulumi.Gcp.Storage;
using Pulumi.SyncedFolder;

return await Deployment.RunAsync(() =>
{
    var bucket = new Bucket("my-bucket", new BucketArgs
    {
        Location = "US"
    });

    var binding = new BucketIAMBinding("binding", new BucketIAMBindingArgs
    {
        Bucket = bucket.Name,
        Role = "roles/storage.objectViewer",
        Members = new[]
        {
            "allUsers",
        }
    });

    var folder = new GoogleCloudFolder("folder", new GoogleCloudFolderArgs
    {
        BucketName = bucket.Name,
        Path = "./my-folder",
    });
});
