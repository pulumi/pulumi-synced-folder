using Pulumi.AzureNative.Resources;
using Pulumi.AzureNative.Storage;
using Pulumi.AzureNative.Storage.Inputs;
using Pulumi.SyncedFolder;

return await Pulumi.Deployment.RunAsync(() =>
{
    var resourceGroup = new ResourceGroup("resource-group");

    var storageAccount = new StorageAccount("account", new StorageAccountArgs
    {
        ResourceGroupName = resourceGroup.Name,
        Kind = Kind.StorageV2,
        Sku = new SkuArgs
        {
            Name = SkuName.Standard_LRS
        },
    });

    var container = new BlobContainer("container", new BlobContainerArgs
    {
        ResourceGroupName = resourceGroup.Name,
        AccountName = storageAccount.Name,
    });

    var folder = new AzureBlobFolder("synced-folder", new AzureBlobFolderArgs
    {
        ResourceGroupName = resourceGroup.Name,
        StorageAccountName = storageAccount.Name,
        ContainerName = container.Name,
        Path = "./my-folder",
    });
});
