using System.Collections.Generic;
using Pulumi;
using Pulumi.Aws.S3;
using Pulumi.Aws.S3.Inputs;
using Pulumi.SyncedFolder;

return await Deployment.RunAsync(() =>
{

    var bucket = new Bucket("s3-bucket", new BucketArgs {
        Acl = CannedAcl.PublicRead,
        Website = new BucketWebsiteArgs {
            IndexDocument = "index.html",
            ErrorDocument = "error.html",
        }
    });

    var folder = new S3BucketFolder("synced-bucket-folder", new S3BucketFolderArgs {
        Path = "./site",
        BucketName = bucket.BucketName,
        Acl = CannedAcl.PublicRead.ToString(),
        ManagedObjects = false,
    });

    return new Dictionary<string, object?>
    {
        ["url"] = Output.Format($"http://{bucket.WebsiteEndpoint}")
    };
});
