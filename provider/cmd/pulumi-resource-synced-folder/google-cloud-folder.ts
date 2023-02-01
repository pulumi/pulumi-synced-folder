// Copyright 2016-2022, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as command from "@pulumi/command";
import * as utils from "./utils";

export interface GoogleCloudFolderArgs {
    path: string;
    bucketName: string;
    managedObjects?: boolean;
    disableManagedObjectAliases?: boolean;
    includeHiddenFiles?: boolean;
}

export class GoogleCloudFolder extends pulumi.ComponentResource {

    constructor(name: string, args: GoogleCloudFolderArgs, opts?: pulumi.ComponentResourceOptions) {
        super("synced-folder:index:GoogleCloudFolder", name, args, opts);

        args.managedObjects = args.managedObjects ?? true;
        args.disableManagedObjectAliases = args.disableManagedObjectAliases ?? false;

        const folderContents = utils.getFolderContents(args.path, args.includeHiddenFiles);
        const syncCommand = pulumi.interpolate`gsutil -q -m rsync -r -d "${args.path}" "gs://${args.bucketName}"`;
        const deleteCommand = pulumi.interpolate`gsutil -q rm "gs://${args.bucketName}/**"`;

        if (args.managedObjects) {
            folderContents.files.map(file => {
                let aliases: pulumi.Alias[] = [];
                if (!args.disableManagedObjectAliases) {
                    aliases = [{
                        name: file.relativePath,
                    }];
                }

                new gcp.storage.BucketObject(`${name}-${file.relativePath}`, {
                    bucket: args.bucketName,
                    name: file.relativePath,
                    source: new pulumi.asset.FileAsset(file.fullPath),
                    contentType: file.contentType,
                }, { parent: this, aliases });
            });

        } else {
            let aliases: pulumi.Alias[] = [];
            if (!args.disableManagedObjectAliases) {
                aliases = [{
                    name: "sync-command",
                }];
            }

            new command.local.Command(`${name}-sync-command`, {
                create: syncCommand,
                update: syncCommand,
                delete: deleteCommand,
                environment: {
                    LAST_MODIFIED: new Date(folderContents.summary.lastModified).toString(),
                }
            }, { parent: this, aliases });
        }

        this.registerOutputs({

        });
    }
}
