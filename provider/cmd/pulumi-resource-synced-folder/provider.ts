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
import * as provider from "@pulumi/pulumi/provider";

import { S3BucketFolder, S3BucketFolderArgs } from "./s3-bucket-folder";
import { AzureBlobFolder, AzureBlobFolderArgs } from "./azure-blob-folder";
import { GoogleCloudFolder, GoogleCloudFolderArgs } from "./google-cloud-folder";

export class Provider implements provider.Provider {
    constructor(readonly version: string, readonly schema: string) { }

    async construct(name: string, type: string, inputs: pulumi.Inputs,
        options: pulumi.ComponentResourceOptions): Promise<provider.ConstructResult> {

        switch (type) {
            case "synced-folder:index:S3BucketFolder":
                return await constructS3BucketFolder(name, inputs, options);
            case "synced-folder:index:AzureBlobFolder":
                return await constructAzureBlobFolder(name, inputs, options);
            case "synced-folder:index:GoogleCloudFolder":
                return await constructGoogleCloudFolder(name, inputs, options);
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    }
}

async function constructS3BucketFolder(name: string, inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions): Promise<provider.ConstructResult> {
    const folder = new S3BucketFolder(name, inputs as S3BucketFolderArgs, options);
    return {
        urn: folder.urn,
        state: {

        },
    };
}

async function constructAzureBlobFolder(name: string, inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions): Promise<provider.ConstructResult> {
    const folder = new AzureBlobFolder(name, inputs as AzureBlobFolderArgs, options);
    return {
        urn: folder.urn,
        state: {

        },
    };
}

async function constructGoogleCloudFolder(name: string, inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions): Promise<provider.ConstructResult> {
    const folder = new GoogleCloudFolder(name, inputs as GoogleCloudFolderArgs, options);
    return {
        urn: folder.urn,
        state: {

        },
    };
}
