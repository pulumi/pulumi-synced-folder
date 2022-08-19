# synced-folder

A Pulumi component that synchronizes a local folder to Amazon S3, Azure Blob, or Google Cloud Storage.

## Installing the component

The component is available in all supported Pulumi-supported languages.

* `npm install @pulumi/synced-folder`
* `yarn add @pulumi/synced-folder`
* `pip install pulumi_synced_folder`
* `go get -t github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder`

## Using the component

Given a cloud-storage bucket and the path to a local folder, the component synchronizes files from the folder to the bucket, deleting any files in the destination bucket that don't exist locally. It does this in one of two configurable ways:

* With Pulumi managing each file as an individual Pulumi resource (e.g., an `aws.s3.BucketObject`, `azure.storage.Blob`, or `gcp.storage.BucketObject`). This is how the component behaves by default.

* With Pulumi not managing any files individually, and instead delegating the responsibility of synchronization to the cloud provider CLI (e.g., the `aws`, `az`, or `gloud` tools respectively). This behavior is enabled by setting the `managedObjects` input property to `false`, and requires that the associated CLI tool is installed on your machine.

The former approach &mdash; having Pulumi manage your resources for you &mdash; is generally safer and therefore preferable, but in some situations, for example a website containing thousands of files, it may not be the best fit. This component lets you choose the approach best suited to your use case without having to break out of your Pulumi program or workflow.

Below are a few examples in Pulumi YAML, each of which assumes the existence of a `site` folder containing one or more files to be uploaded. See the [examples](./examples) folder for additional languages and scenarios.

### Sync the contents of a folder to Amazon S3

In this example, a local folder, `./site`, is pushed to Amazon S3, and its contents are managed as individual `aws.s3.BucketObject`s in the usual way:

```yaml
name: synced-folder-examples-aws-yaml
runtime: yaml
description: An example of using the synced-folder component.

resources:

  # Create an S3 bucket and configure it as a website.
  s3-bucket:
    type: aws:s3:Bucket
    properties:
      acl: public-read
      website:
        indexDocument: index.html
        errorDocument: error.html

  # Sync the contents of the ./site to the bucket
  synced-bucket-folder:
    type: synced-folder:index:S3BucketFolder
    properties:
      path: ./site
      bucketName: ${s3-bucket.bucket}
      acl: public-read

outputs:
  url: http://${s3-bucket.websiteEndpoint}
```

### Sync the contents of a folder to Azure Blob Storage

In this example, the folder's contents are synced to an Azure Blob Storage Container, but by way of the Azure CLI (specifically the `az storage blob sync` sommand) by way of the [Pulumi Command](https://www.pulumi.com/registry/packages/command/) provider. The optional `managedObjects` property lets you configure this behavior on a folder-by-folder basis.

```yaml
name: synced-folder-examples-azure-yaml
runtime: yaml
description: An example of using the synced-folder component in YAML.

resources:

  # Create an Azure resource group.
  resource-group:
    type: azure-native:resources:ResourceGroup

  # Create an Azure Blob Storage account.
  storage:
    type: azure-native:storage:StorageAccount
    properties:
      resourceGroupName: ${resource-group.name}
      kind: StorageV2
      sku:
        name: Standard_LRS

  # Configure the storage account as a website.
  website:
    type: azure-native:storage:StorageAccountStaticWebsite
    properties:
      resourceGroupName: ${resource-group.name}
      accountName: ${storage.name}
      indexDocument: index.html
      error404Document: error.html

  # Sync the contents of ./site to the storage container, using the Pulumi
  # Command provider and the Azure CLI to manage the files directly.
  synced-azure-blob-folder:
    type: synced-folder:index:AzureBlobFolder
    properties:
      path: ./site
      resourceGroupName: ${resource-group.name}
      storageAccountName: ${storage.name}
      containerName: ${website.containerName}
      managedObjects: false

outputs:
  url: ${storage.primaryEndpoints.web}
```

### Sync the contents of a folder to Google Cloud Storage

In this example, the `./site` folder is synced to Google Cloud Storage.

```yaml
name: synced-folder-examples-google-cloud-yaml
runtime: yaml
description: An example of using the synced-folder component in YAML.

resources:

  # Create a Google Cloud Storage bucket and configure it as a website.
  gcp-bucket:
    type: gcp:storage:Bucket
    properties:
      location: US
      website:
        mainPageSuffix: index.html
        notFoundPage: error.html

  # Configure the bucket for public access.
  gcp-bucket-iam-binding:
    type: gcp:storage:BucketIAMBinding
    properties: 
      bucket: ${gcp-bucket.name}
      role: roles/storage.objectViewer
      members: 
        - allUsers

  # Sync the contents of the ./site folder to the bucket.
  synced-google-cloud-folder:
    type: synced-folder:index:GoogleCloudFolder
    properties:
      path: ./site
      bucketName: ${gcp-bucket.name}

outputs:
  url: https://storage.googleapis.com/${gcp-bucket.name}/index.html
```

## Configuration

### Common properties

The following input properties are common to all three resource types:

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `path` | `string` | The relative or fully-qualified path to the folder containing the files to be uploaded. Required. | 
| `managedObjects` | `boolean` | Whether to have Pulumi manage files as individual cloud resources. Defaults to `true`. See below for details. |

### `S3BucketFolder` properties

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `bucketName` | `string` | The name of the S3 bucket to sync to (e.g., `my-bucket` in `s3://my-bucket`). Required. |
| `acl` | `string` | The AWS [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl) to apply to uploaded files (e.g., `public-read`). Required. |

### `AzureBlobFolder` properties

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `resourceGroupName` | `string` | The name of the Azure resource group that the destination storage account belongs to. Required. |
| `storageAccountName` | `string` | The name of the Azure storage account that the target storage container belongs to. Required. |
| `containerName` | `string` | The name of the storage container to sync to. Required. |

### `GoogleCloudFolder` properties

| Property | Type | Description | 
| -------- | ---- | ----------- | 
| `bucketName` | `string` | The name of the Google Cloud Storage bucket to sync to (e.g., `my-bucket` in `gs://my-bucket`). Required. |

## Notes

### Using the `managedObjects` setting

By default, the component manages your files as individual Pulumi cloud resources. You can, however, opt out of this behavior by setting the component's `managedObjects` property to `false`. When you do this, the component assumes you've installed the associated CLI tool &mdash; [`aws`](https://aws.amazon.com/cli/), [`az`](https://docs.microsoft.com/en-us/cli/azure/), or [`gcloud`/`gsutil`](https://cloud.google.com/storage/docs/gsutil), depending on the cloud &mdash; and uses the [Command](https://www.pulumi.com/registry/packages/command/) provider to issue commands on that CLI tool directly. Files are one-way synchronized only (local-to-remote), and files that exist remotely but not locally are deleted. All files are deleted from remote storage on `pulumi destroy`.

The component does not yet support switching seamlessly between `managedObjects: true` and `managedObjects: false`, however, so if you find after deploying a given folder with managed objects that you'd like to use unmanaged objects instead or vice-versa), we recommend creating a second bucket/storage container and removing the first. For example:

```yaml
# ...

resources:
    
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
  url: http://${changed-my-mind-bucket.websiteEndpoint}
```
