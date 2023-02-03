using Pulumi;
using Pulumi.Aws.S3;
using Pulumi.SyncedFolder;

return await Deployment.RunAsync(() =>
{

    var bucket = new Bucket("my-bucket", new BucketArgs {
        Acl = CannedAcl.PublicRead,
    });

    var folder = new S3BucketFolder("synced-bucket-folder", new S3BucketFolderArgs {
        Path = "./my-folder",
        BucketName = bucket.BucketName,
        Acl = (string)CannedAcl.PublicRead,
        ManagedObjects = false,
        IncludeHiddenFiles = true,
    });
});
