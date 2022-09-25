import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as synced from "@pulumi/synced-folder";

const resourceGroup = new resources.ResourceGroup("resourceGroup");

const account = new storage.StorageAccount("account", {
    resourceGroupName: resourceGroup.name,
    kind: storage.Kind.StorageV2,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
});

const container = new storage.BlobContainer("container", {
    resourceGroupName: resourceGroup.name,
    accountName: account.name,
});

const folder = new synced.AzureBlobFolder("synced-folder", {
    resourceGroupName: resourceGroup.name,
    storageAccountName: account.name,
    containerName: container.name,
    path: "./my-folder",
});
