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
import * as storage from "@pulumi/azure-native/storage";
import * as command from "@pulumi/command";
import * as utils from "./utils";

export interface AzureBlobFolderArgs {
    path: string;
    storageAccountName: string;
    resourceGroupName: string;
    containerName: string;
    managedObjects?: boolean;
}

export class AzureBlobFolder extends pulumi.ComponentResource { 
    
    constructor(name: string, args: AzureBlobFolderArgs, opts?: pulumi.ComponentResourceOptions) {
        super("synced-folder:index:AzureBlobFolder", name, args, opts);

        args.managedObjects = args.managedObjects !== false;

        const contents = utils.getFolderContents(args.path);

        if (args.managedObjects) {

            contents.files.map(file => {
                new storage.Blob(file.relativePath, {
                    accountName: args.storageAccountName,
                    resourceGroupName: args.resourceGroupName,
                    containerName: args.containerName,
                    source: new pulumi.asset.FileAsset(file.fullPath),
                    contentType: file.contentType,
                }, { parent: this, retainOnDelete: !args.managedObjects });
            });
        
        } else {
            
            const sync = new command.local.Command("sync-command", {
                create: pulumi.interpolate`az storage blob sync --source "${args.path}" --account-name "${args.storageAccountName}" --container '${args.containerName}' --delete-destination true`,
                triggers: [
                    contents.summary.lastModified,
                ],
            }, { parent: this, deleteBeforeReplace: true });    
        }

        this.registerOutputs({
            
        });
    }
}
