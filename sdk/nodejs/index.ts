// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

// Export members:
export { AzureBlobFolderArgs } from "./azureBlobFolder";
export type AzureBlobFolder = import("./azureBlobFolder").AzureBlobFolder;
export const AzureBlobFolder: typeof import("./azureBlobFolder").AzureBlobFolder = null as any;
utilities.lazyLoad(exports, ["AzureBlobFolder"], () => require("./azureBlobFolder"));

export { GoogleCloudFolderArgs } from "./googleCloudFolder";
export type GoogleCloudFolder = import("./googleCloudFolder").GoogleCloudFolder;
export const GoogleCloudFolder: typeof import("./googleCloudFolder").GoogleCloudFolder = null as any;
utilities.lazyLoad(exports, ["GoogleCloudFolder"], () => require("./googleCloudFolder"));

export { ProviderArgs } from "./provider";
export type Provider = import("./provider").Provider;
export const Provider: typeof import("./provider").Provider = null as any;
utilities.lazyLoad(exports, ["Provider"], () => require("./provider"));

export { S3BucketFolderArgs } from "./s3bucketFolder";
export type S3BucketFolder = import("./s3bucketFolder").S3BucketFolder;
export const S3BucketFolder: typeof import("./s3bucketFolder").S3BucketFolder = null as any;
utilities.lazyLoad(exports, ["S3BucketFolder"], () => require("./s3bucketFolder"));


const _module = {
    version: utilities.getVersion(),
    construct: (name: string, type: string, urn: string): pulumi.Resource => {
        switch (type) {
            case "synced-folder:index:AzureBlobFolder":
                return new AzureBlobFolder(name, <any>undefined, { urn })
            case "synced-folder:index:GoogleCloudFolder":
                return new GoogleCloudFolder(name, <any>undefined, { urn })
            case "synced-folder:index:S3BucketFolder":
                return new S3BucketFolder(name, <any>undefined, { urn })
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    },
};
pulumi.runtime.registerResourceModule("synced-folder", "index", _module)
pulumi.runtime.registerResourcePackage("synced-folder", {
    version: utilities.getVersion(),
    constructProvider: (name: string, type: string, urn: string): pulumi.ProviderResource => {
        if (type !== "pulumi:providers:synced-folder") {
            throw new Error(`unknown provider type ${type}`);
        }
        return new Provider(name, <any>undefined, { urn });
    },
});
