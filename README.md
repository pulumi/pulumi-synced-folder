# synced-folder

A Pulumi component that synchronizes a local folder to Amazon S3, Azure Blob Storage, or Google Cloud Storage.

## Installing

The component is available in these Pulumi-supported languages:

* JavaScript/TypeScript: [`@pulumi/synced-folder`](https://www.npmjs.com/package/@pulumi/synced-folder)
* Python: [`pulumi_synced_folder`](https://pypi.org/project/pulumi-synced-folder/)
* Go: [`github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder`](https://github.com/pulumi/pulumi-synced-folder/)
* .NET: [`Pulumi.SyncedFolder`](https://www.nuget.org/packages/Pulumi.SyncedFolder)
* YAML

## Using the component

Given a cloud-storage bucket and the path to a local folder, the component synchronizes files from the folder to the bucket, deleting any files in the destination bucket that don't exist locally. It does this in one of two ways:

* By managing each file as an individual Pulumi resource (`aws.s3.BucketObject`, `azure.storage.Blob`, or `gcp.storage.BucketObject`). This is the component's default behavior.

* By delegating sync responsibility to a cloud provider CLI (e.g., [`aws`](https://aws.amazon.com/cli/), [`az`](https://docs.microsoft.com/en-us/cli/azure/), or [`gcloud`/`gsutil`](https://cloud.google.com/storage/docs/gsutil)). This behavior is enabled by setting the `managedObjects` input property to `false` and ensuring the relevant CLI tool is installed alongside `pulumi`.

The former approach &mdash; having Pulumi manage your resources for you &mdash; is generally preferable, but in some cases, for example  a website consisting of thousands of files, it may not be the best fit. This component lets you choose the approach that works best for you, without having to brek out of your Pulumi program or workflow.

Below are a few examples in Pulumi YAML, each of which assumes the existence of a `site` folder containing one or more files to be uploaded. See the [examples](./examples) folder for additional languages and scenarios.

### Sync to an S3 bucket

Here, a local folder, `./site`, is pushed to Amazon S3, its contents managed as individual `s3.BucketObject`s:


```yaml
name: synced-folder-examples-aws-yaml
runtime: yaml
description: An example of using the synced-folder component.

resources:

  s3-bucket:
    type: aws:s3:Bucket
    properties:
      acl: public-read
      website:
        indexDocument: index.html
        errorDocument: error.html
  
  # 👇
  synced-bucket-folder:
    type: synced-folder:index:S3BucketFolder
    properties:
      path: ./site
      bucketName: ${s3-bucket.bucket}
      acl: public-read

outputs:
  url: http://${s3-bucket.websiteEndpoint}
```

### Sync to an Azure Blob Storage container

Here, the folder's contents are synced to an Azure Blob Storage container, but instead of managing each file as an `azure.storage.Blob`, the component invokes the Azure CLI (specifically the `az storage blob sync` command) with [Pulumi Command](https://www.pulumi.com/registry/packages/command/). The optional `managedObjects` property lets you configure this behavior on a folder-by-folder basis.

```yaml
name: synced-folder-examples-azure-yaml
runtime: yaml
description: An example of using the synced-folder component in YAML.

resources:

  resource-group:
    type: azure-native:resources:ResourceGroup

  storage:
    type: azure-native:storage:StorageAccount
    properties:
      resourceGroupName: ${resource-group.name}
      kind: StorageV2
      sku:
        name: Standard_LRS

  website:
    type: azure-native:storage:StorageAccountStaticWebsite
    properties:
      resourceGroupName: ${resource-group.name}
      accountName: ${storage.name}
      indexDocument: index.html
      error404Document: error.html

  # 👇
  synced-azure-blob-folder:
    type: synced-folder:index:AzureBlobFolder
    properties:
      path: ./site
      resourceGroupName: ${resource-group.name}
      storageAccountName: ${storage.name}
      containerName: ${website.containerName}
      managedObjects: false  # 👈  Sync files with the Azure CLI.

outputs:
  url: ${storage.primaryEndpoints.web}
```

### Sync to a Google Cloud Storage bucket

Here, `./site` is synced to a Google Cloud Storage bucket.

```yaml
name: synced-folder-examples-google-cloud-yaml
runtime: yaml
description: An example of using the synced-folder component in YAML.

resources:

  gcp-bucket:
    type: gcp:storage:Bucket
    properties:
      location: US
      website:
        mainPageSuffix: index.html
        notFoundPage: error.html

  gcp-bucket-iam-binding:
    type: gcp:storage:BucketIAMBinding
    properties: 
      bucket: ${gcp-bucket.name}
      role: roles/storage.objectViewer
      members: 
        - allUsers

  # 👇
  synced-google-cloud-folder:
    type: synced-folder:index:GoogleCloudFolder
    properties:
      path: ./site
      bucketName: ${gcp-bucket.name}

outputs:
  url: https://storage.googleapis.com/${gcp-bucket.name}/index.html
```

## Configuration


The following input properties are common to all three resource types:

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `path` | `string` | The path (relative or fully-qualified) to the folder containing the files to be synced. Required. | 
| `managedObjects` | `boolean` | Whether to have Pulumi manage files as individual cloud resources. Defaults to `true`. See below for details. |

Additional resource-specific properties are listed below.

### `S3BucketFolder` properties

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `bucketName` | `string` | The name of the S3 bucket to sync to (e.g., `my-bucket` in `s3://my-bucket`). Required. |
| `acl` | `string` | The AWS [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl) to apply to each file (e.g., `public-read`). Required. |

### `AzureBlobFolder` properties

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `containerName` | `string` | The name of the Azure storage container to sync to. Required. |
| `storageAccountName` | `string` | The name of the Azure storage account that the container belongs to. Required. |
| `resourceGroupName` | `string` | The name of the Azure resource group that the storage account belongs to. Required. |

### `GoogleCloudFolder` properties

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `bucketName` | `string` | The name of the Google Cloud Storage bucket to sync to (e.g., `my-bucket` in `gs://my-bucket`). Required. |

## Notes

### Using the `managedObjects` property

By default, the component manages your files as individual Pulumi cloud resources, but you can opt out of this behavior by setting the component's `managedObjects` property to `false`. When you do this, the component assumes you've installed the appropriate CLI tool &mdash; [`aws`](https://aws.amazon.com/cli/), [`az`](https://docs.microsoft.com/en-us/cli/azure/), or [`gcloud`/`gsutil`](https://cloud.google.com/storage/docs/gsutil), depending on the cloud &mdash; and uses the [Command](https://www.pulumi.com/registry/packages/command/) provider to issue commands on that tool directly. Files are one-way synchronized only (local to remote), and files that exist remotely but not locally are deleted. All files are deleted from remote storage on `pulumi destroy`.

The component does not yet support switching seamlessly between `managedObjects: true` and `managedObjects: false`, however, so if you find after deploying a given folder with managed objects that you'd prefer to use unmanaged objects instead (or vice-versa), we recommend creating a second bucket/storage container and folder and removing the first. You can generally do this within the scope of a single program update. For example:

```yaml
# ...

resources:

  # The original bucket and synced-folder resources, using managed file objects.
  # 
  # my-first-bucket:
  #   type: aws:s3:Bucket
  #   properties:
  #     acl: public-read  
  #     website:
  #       indexDocument: index.html
  #       errorDocument: error.html
  #
  # my-first-synced-folder:
  #   type: synced-folder:index:S3BucketFolder
  #   properties:
  #     path: ./stuff
  #     bucketName: ${my-first-bucket.bucket}
  #     acl: public-read

  # A new bucket and synced-folder using unmanaged file objects.
  changed-my-mind-bucket:
    type: aws:s3:Bucket
    properties:
      acl: public-read
      website:
        indexDocument: index.html
        errorDocument: error.html

  changed-my-mind-synced-folder:
    type: synced-folder:index:S3BucketFolder
    properties:
      path: ./stuff
      bucketName: ${changed-my-mind-bucket.bucket}
      acl: public-read
      managedObjects: false 

outputs:

  # An updated program reference pointing to the new bucket.
  url: http://${changed-my-mind-bucket.websiteEndpoint}
```
