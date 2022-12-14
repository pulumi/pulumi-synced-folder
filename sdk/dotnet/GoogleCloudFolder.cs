// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.SyncedFolder
{
    [SyncedFolderResourceType("synced-folder:index:GoogleCloudFolder")]
    public partial class GoogleCloudFolder : Pulumi.ComponentResource
    {
        /// <summary>
        /// Create a GoogleCloudFolder resource with the given unique name, arguments, and options.
        /// </summary>
        ///
        /// <param name="name">The unique name of the resource</param>
        /// <param name="args">The arguments used to populate this resource's properties</param>
        /// <param name="options">A bag of options that control this resource's behavior</param>
        public GoogleCloudFolder(string name, GoogleCloudFolderArgs args, ComponentResourceOptions? options = null)
            : base("synced-folder:index:GoogleCloudFolder", name, args ?? new GoogleCloudFolderArgs(), MakeResourceOptions(options, ""), remote: true)
        {
        }

        private static ComponentResourceOptions MakeResourceOptions(ComponentResourceOptions? options, Input<string>? id)
        {
            var defaultOptions = new ComponentResourceOptions
            {
                Version = Utilities.Version,
            };
            var merged = ComponentResourceOptions.Merge(defaultOptions, options);
            // Override the ID if one was specified for consistency with other language SDKs.
            merged.Id = id ?? merged.Id;
            return merged;
        }
    }

    public sealed class GoogleCloudFolderArgs : Pulumi.ResourceArgs
    {
        /// <summary>
        /// The name of the Google Cloud Storage bucket to sync to (e.g., `my-bucket` in `gs://my-bucket`). Required.
        /// </summary>
        [Input("bucketName", required: true)]
        public Input<string> BucketName { get; set; } = null!;

        /// <summary>
        /// Whether to have Pulumi manage files as individual cloud resources. Defaults to `true`.
        /// </summary>
        [Input("managedObjects")]
        public Input<bool>? ManagedObjects { get; set; }

        /// <summary>
        /// The path (relative or fully-qualified) to the folder containing the files to be synced. Required.
        /// </summary>
        [Input("path", required: true)]
        public Input<string> Path { get; set; } = null!;

        public GoogleCloudFolderArgs()
        {
        }
    }
}
