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
import * as aws from "@pulumi/aws";
import * as command from "@pulumi/command";
import * as utils from "./utils";

export interface S3BucketFolderArgs {
    path: string;
    bucketName: string;
    acl: string;
    managedObjects?: boolean;
}

export class S3BucketFolder extends pulumi.ComponentResource { 
    
    constructor(name: string, args: S3BucketFolderArgs, opts?: pulumi.ComponentResourceOptions) {
        super("synced-folder:index:S3BucketFolder", name, args, opts);

        args.managedObjects = args.managedObjects !== false;
        
        const folderContents = utils.getFolderContents(args.path);
        const region = pulumi.output(aws.getRegion());
        const syncCommand = pulumi.interpolate`aws s3 sync "${args.path}" "s3://${args.bucketName}" --acl "${args.acl}" --region "${region.name}" --delete --only-show-errors`;
        const deleteCommand = pulumi.interpolate`aws s3 rm "s3://${args.bucketName}" --include "*" --recursive --only-show-errors`;

        if (args.managedObjects) {

            folderContents.files.map(file => {
                new aws.s3.BucketObject(file.fullPath, {
                    acl: args.acl,
                    bucket: args.bucketName,
                    contentType: file.contentType,
                    source: new pulumi.asset.FileAsset(file.fullPath),
                    key: file.relativePath,
                }, { parent: this });
            });
        
        } else {
            
            new command.local.Command("sync-command", {
                create: syncCommand,
                update:  syncCommand,
                delete: deleteCommand,
                environment: {
                    LAST_MODIFIED: new Date(folderContents.summary.lastModified).toString(),
                },
            }, { parent: this });    
        }

        this.registerOutputs({
            
        });
    }
}
