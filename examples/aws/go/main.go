package main

import (
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/s3"
	synced "github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		
		bucket, err := s3.NewBucket(ctx, "s3-bucket", &s3.BucketArgs{
			Acl: s3.CannedAclPublicRead,
			Website: s3.BucketWebsiteArgs{
				IndexDocument: pulumi.String("index.html"),
				ErrorDocument: pulumi.String("error.html"),
			},
		})
		if err != nil {
			return err
		}

		_, err = synced.NewS3BucketFolder(ctx, "synced-bucket-folder", &synced.S3BucketFolderArgs{
			Path: pulumi.String("./site"),
			Acl: s3.CannedAclPublicRead,
			BucketName: bucket.Bucket,
		})

		ctx.Export("url", pulumi.Sprintf("http://%s", bucket.WebsiteEndpoint))
		return nil
	})
}
