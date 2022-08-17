// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

// Export members:
export * from "./azureBlobFolder";
export * from "./googleCloudFolder";
export * from "./provider";
export * from "./s3bucketFolder";

// Import resources to register:
import { AzureBlobFolder } from "./azureBlobFolder";
import { GoogleCloudFolder } from "./googleCloudFolder";
import { S3BucketFolder } from "./s3bucketFolder";

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

import { Provider } from "./provider";

pulumi.runtime.registerResourcePackage("synced-folder", {
    version: utilities.getVersion(),
    constructProvider: (name: string, type: string, urn: string): pulumi.ProviderResource => {
        if (type !== "pulumi:providers:synced-folder") {
            throw new Error(`unknown provider type ${type}`);
        }
        return new Provider(name, <any>undefined, { urn });
    },
});
