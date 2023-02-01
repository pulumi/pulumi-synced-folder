package main

import (
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/s3"
	synced "github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		bucket, err := s3.NewBucket(ctx, "my-bucket", &s3.BucketArgs{
			Acl: s3.CannedAclPublicRead,
		})
		if err != nil {
			return err
		}

		_, err = synced.NewS3BucketFolder(ctx, "synced-folder", &synced.S3BucketFolderArgs{
			Path:               pulumi.String("./my-folder"),
			BucketName:         bucket.Bucket,
			Acl:                s3.CannedAclPublicRead,
			ManagedObjects:     pulumi.Bool(false),
			IncludeHiddenFiles: pulumi.Bool(true),
		})
		if err != nil {
			return err
		}

		return nil
	})
}
