// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

export class GoogleCloudFolder extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'synced-folder:index:GoogleCloudFolder';

    /**
     * Returns true if the given object is an instance of GoogleCloudFolder.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is GoogleCloudFolder {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === GoogleCloudFolder.__pulumiType;
    }


    /**
     * Create a GoogleCloudFolder resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: GoogleCloudFolderArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.bucketName === undefined) && !opts.urn) {
                throw new Error("Missing required property 'bucketName'");
            }
            if ((!args || args.path === undefined) && !opts.urn) {
                throw new Error("Missing required property 'path'");
            }
            resourceInputs["bucketName"] = args ? args.bucketName : undefined;
            resourceInputs["disableManagedObjectAliases"] = args ? args.disableManagedObjectAliases : undefined;
            resourceInputs["includeHiddenFiles"] = args ? args.includeHiddenFiles : undefined;
            resourceInputs["managedObjects"] = args ? args.managedObjects : undefined;
            resourceInputs["path"] = args ? args.path : undefined;
        } else {
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(GoogleCloudFolder.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a GoogleCloudFolder resource.
 */
export interface GoogleCloudFolderArgs {
    /**
     * The name of the Google Cloud Storage bucket to sync to (e.g., `my-bucket` in `gs://my-bucket`). Required.
     */
    bucketName: pulumi.Input<string>;
    /**
     * Disables adding an [alias](https://www.pulumi.com/docs/intro/concepts/resources/options/aliases/) resource option to managed objects in the bucket.
     */
    disableManagedObjectAliases?: pulumi.Input<boolean>;
    /**
     * Include hidden files ("dotfiles") when synchronizing folders. Defaults to `false`.
     */
    includeHiddenFiles?: pulumi.Input<boolean>;
    /**
     * Whether to have Pulumi manage files as individual cloud resources. Defaults to `true`.
     */
    managedObjects?: pulumi.Input<boolean>;
    /**
     * The path (relative or fully-qualified) to the folder containing the files to be synced. Required.
     */
    path: pulumi.Input<string>;
}
