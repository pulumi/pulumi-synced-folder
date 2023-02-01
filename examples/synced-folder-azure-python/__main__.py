import resource
from pulumi_azure_native import storage
from pulumi_azure_native import resources
import pulumi_synced_folder

resource_group = resources.ResourceGroup("resource_group")

account = storage.StorageAccount("account", storage.StorageAccountArgs(
    resource_group_name=resource_group.name,
    kind=storage.Kind.STORAGE_V2,
    sku=storage.SkuArgs(
        name=storage.SkuName.STANDARD_LRS,
    )
))

container = storage.BlobContainer("container", storage.BlobContainerArgs(
    resource_group_name=resource_group.name,
    account_name=account.name,
))

folder = pulumi_synced_folder.AzureBlobFolder("synced-folder", pulumi_synced_folder.AzureBlobFolderArgs(
    resource_group_name=resource_group.name,
    storage_account_name=account.name,
    container_name=container.name,
    path="./my-folder",
    include_hidden_files=True
))
