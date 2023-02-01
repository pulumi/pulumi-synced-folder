package main

import (
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/resources"
	"github.com/pulumi/pulumi-azure-native/sdk/go/azure/storage"
	synced "github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		resourceGroup, err := resources.NewResourceGroup(ctx, "resourceGroup", nil)
		if err != nil {
			return err
		}

		account, err := storage.NewStorageAccount(ctx, "account", &storage.StorageAccountArgs{
			ResourceGroupName: resourceGroup.Name,
			Kind:              pulumi.String("StorageV2"),
			Sku: &storage.SkuArgs{
				Name: pulumi.String("Standard_LRS"),
			},
		})
		if err != nil {
			return err
		}

		container, err := storage.NewBlobContainer(ctx, "container", &storage.BlobContainerArgs{
			ResourceGroupName: resourceGroup.Name,
			AccountName:       account.Name,
		})
		if err != nil {
			return err
		}

		_, err = synced.NewAzureBlobFolder(ctx, "folder", &synced.AzureBlobFolderArgs{
			ResourceGroupName:  resourceGroup.Name,
			StorageAccountName: account.Name,
			ContainerName:      container.Name,
			Path:               pulumi.String("./my-folder"),
			IncludeHiddenFiles: pulumi.Bool(true),
		})
		if err != nil {
			return err
		}

		return nil
	})
}
