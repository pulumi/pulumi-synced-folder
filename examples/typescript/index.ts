import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as synced from "@pulumi/synced-folder";

// const myS3Bucket = new aws.s3.Bucket("s3-bucket", {
//     acl: "public-read",
//     forceDestroy: true,
//     website: {
//         indexDocument: "index.html",
//         errorDocument: "error.html",
//     },
// });

// const s3Folder = new synced.S3BucketFolder("s3-folder", {
//     path: "./site",
//     bucketName: myS3Bucket.bucket,
//     acl: "public-read",
//     managedObjects: false,
// });

const resourceGroup = new resources.ResourceGroup("resource-group");
const storageAccount = new storage.StorageAccount("storage", {
    resourceGroupName: resourceGroup.name,
    kind: storage.Kind.StorageV2,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
});

const website = new storage.StorageAccountStaticWebsite("azure-website", {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    indexDocument: "index.html",
    error404Document: "error.html",
});


const folder = new synced.AzureBlobFolder("azure-folder", {
    containerName: website.containerName,
    resourceGroupName: resourceGroup.name,
    storageAccountName: storageAccount.name,
    path: "./site",
    managedObjects: false,
});

export const { containerName } = website;
export const azureEndpoint = storageAccount.primaryEndpoints.web;
