# synced-folder

A Pulumi component that synchronizes a local folder to Amazon S3, Azure Blob, or Google Cloud Storage.

## Installing the component

The component is available in all supported Pulumi-supported languages.

```bash
npm install @pulumi/synced-folder
```

```bash
yarn add @pulumi/synced-folder
```

```bash
pip install pulumi_synced_folder
```

```bash
go get -t github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder
```

## Using the component

Given a cloud-storage bucket and the path to a local folder, the component synchronizes files from the folder to the bucket, deleting any files in the destination bucket that don't exist locally. It does this in one of two configurable ways:

* With Pulumi managing each file as an individual Pulumi resource (e.g., an `aws.s3.BucketObject`, `azure.storage.Blob`, or `gcp.storage.BucketObject`). This is how the component behaves by default.

* With Pulumi not managing any files individually, and instead delegating the responsibility of synchronization to the cloud provider CLI (e.g., the `aws`, `az`, or `gloud` tools respectively). This behavior is enabled by the `managedObjects` input property. 

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

In this example, the folder's contents are synced to an Azure Blob Storage Container, but by way of the Azure CLI (specifically the `az storage blob sync` sommand) by way of the Pulumi Command provider. The optional `managedObjects` property lets you configure this behavior on a folder-by-folder basis.

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

  # Sync the contents of ./site to the storage container. Here, rather
  # than use Pulumi to manage file blobs individually, we use the Pulumi
  # Command provider and the Azure CLI to manage the files ourselves.
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
