// Copyright 2016-2021, Pulumi Corporation.
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
    manageObjects: boolean;
}

export class S3BucketFolder extends pulumi.ComponentResource { 
    
    constructor(name: string, args: S3BucketFolderArgs, opts?: pulumi.ComponentResourceOptions) {
        super("synced-folder:index:S3BucketFolder", name, args, opts);

        // Set some defaults.
        args.manageObjects = args.manageObjects !== false;

        const files = utils.getFiles(args.path);

        if (args.manageObjects) {

            files.map(file => {
                const contentFile = new aws.s3.BucketObject(file.relativePath, {
                    acl: args.acl,
                    bucket: args.bucketName,
                    contentType: file.mimeType,
                    source: new pulumi.asset.FileAsset(file.fullPath),
                }, { parent: this });
            });
        
        } else {
            
            const region = pulumi.output(aws.getRegion());
            const sync = new command.local.Command("s3-sync", {
                create: pulumi.interpolate`aws s3 sync ${args.path} s3://${args.bucketName} --acl ${args.acl} --delete --region ${region.name}`,
                update: pulumi.interpolate`aws s3 sync ${args.path} s3://${args.bucketName} --acl ${args.acl} --delete --region ${region.name}`,
                delete: pulumi.interpolate`aws s3 sync ${args.path} s3://${args.bucketName} --acl ${args.acl} --delete --region ${region.name}`,
            }, { parent: this });    
        }

        this.registerOutputs({
            // path: args.path,
            // bucketName: args.bucketName,
            // acl: args.acl,
            // manageObjects: args.manageObjects,
        });
    }
}
