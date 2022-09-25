package main

import (
	"github.com/pulumi/pulumi-gcp/sdk/v6/go/gcp/storage"
	synced "github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		bucket, err := storage.NewBucket(ctx, "my-bucket", &storage.BucketArgs{
			Location: pulumi.String("US"),
		})
		if err != nil {
			return err
		}

		_, err = storage.NewBucketIAMBinding(ctx, "binding", &storage.BucketIAMBindingArgs{
			Bucket:  bucket.Name,
			Role:    pulumi.String("roles/storage.objectViewer"),
			Members: pulumi.ToStringArray([]string{"allUsers"}),
		})
		if err != nil {
			return err
		}

		_, err = synced.NewGoogleCloudFolder(ctx, "folder", &synced.GoogleCloudFolderArgs{
			BucketName: bucket.Name,
			Path:       pulumi.String("./my-folder"),
		})
		if err != nil {
			return err
		}

		return nil
	})
}
