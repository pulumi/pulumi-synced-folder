// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package syncedfolder

import (
	"context"
	"reflect"

	"errors"
	"github.com/pulumi/pulumi-synced-folder/sdk/go/synced-folder/internal"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type AzureBlobFolder struct {
	pulumi.ResourceState
}

// NewAzureBlobFolder registers a new resource with the given unique name, arguments, and options.
func NewAzureBlobFolder(ctx *pulumi.Context,
	name string, args *AzureBlobFolderArgs, opts ...pulumi.ResourceOption) (*AzureBlobFolder, error) {
	if args == nil {
		return nil, errors.New("missing one or more required arguments")
	}

	if args.ContainerName == nil {
		return nil, errors.New("invalid value for required argument 'ContainerName'")
	}
	if args.Path == nil {
		return nil, errors.New("invalid value for required argument 'Path'")
	}
	if args.ResourceGroupName == nil {
		return nil, errors.New("invalid value for required argument 'ResourceGroupName'")
	}
	if args.StorageAccountName == nil {
		return nil, errors.New("invalid value for required argument 'StorageAccountName'")
	}
	opts = internal.PkgResourceDefaultOpts(opts)
	var resource AzureBlobFolder
	err := ctx.RegisterRemoteComponentResource("synced-folder:index:AzureBlobFolder", name, args, &resource, opts...)
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

type azureBlobFolderArgs struct {
	// The name of the Azure storage container to sync to. Required.
	ContainerName string `pulumi:"containerName"`
	// Disables adding an [alias](https://www.pulumi.com/docs/intro/concepts/resources/options/aliases/) resource option to managed objects in the bucket.
	DisableManagedObjectAliases *bool `pulumi:"disableManagedObjectAliases"`
	// Include hidden files ("dotfiles") when synchronizing folders. Defaults to `false`.
	IncludeHiddenFiles *bool `pulumi:"includeHiddenFiles"`
	// Whether to have Pulumi manage files as individual cloud resources. Defaults to `true`.
	ManagedObjects *bool `pulumi:"managedObjects"`
	// The path (relative or fully-qualified) to the folder containing the files to be synced. Required.
	Path string `pulumi:"path"`
	// The name of the Azure resource group that the storage account belongs to. Required.
	ResourceGroupName string `pulumi:"resourceGroupName"`
	// The name of the Azure storage account that the container belongs to. Required.
	StorageAccountName string `pulumi:"storageAccountName"`
}

// The set of arguments for constructing a AzureBlobFolder resource.
type AzureBlobFolderArgs struct {
	// The name of the Azure storage container to sync to. Required.
	ContainerName pulumi.StringInput
	// Disables adding an [alias](https://www.pulumi.com/docs/intro/concepts/resources/options/aliases/) resource option to managed objects in the bucket.
	DisableManagedObjectAliases pulumi.BoolPtrInput
	// Include hidden files ("dotfiles") when synchronizing folders. Defaults to `false`.
	IncludeHiddenFiles pulumi.BoolPtrInput
	// Whether to have Pulumi manage files as individual cloud resources. Defaults to `true`.
	ManagedObjects pulumi.BoolPtrInput
	// The path (relative or fully-qualified) to the folder containing the files to be synced. Required.
	Path pulumi.StringInput
	// The name of the Azure resource group that the storage account belongs to. Required.
	ResourceGroupName pulumi.StringInput
	// The name of the Azure storage account that the container belongs to. Required.
	StorageAccountName pulumi.StringInput
}

func (AzureBlobFolderArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*azureBlobFolderArgs)(nil)).Elem()
}

type AzureBlobFolderInput interface {
	pulumi.Input

	ToAzureBlobFolderOutput() AzureBlobFolderOutput
	ToAzureBlobFolderOutputWithContext(ctx context.Context) AzureBlobFolderOutput
}

func (*AzureBlobFolder) ElementType() reflect.Type {
	return reflect.TypeOf((**AzureBlobFolder)(nil)).Elem()
}

func (i *AzureBlobFolder) ToAzureBlobFolderOutput() AzureBlobFolderOutput {
	return i.ToAzureBlobFolderOutputWithContext(context.Background())
}

func (i *AzureBlobFolder) ToAzureBlobFolderOutputWithContext(ctx context.Context) AzureBlobFolderOutput {
	return pulumi.ToOutputWithContext(ctx, i).(AzureBlobFolderOutput)
}

// AzureBlobFolderArrayInput is an input type that accepts AzureBlobFolderArray and AzureBlobFolderArrayOutput values.
// You can construct a concrete instance of `AzureBlobFolderArrayInput` via:
//
//	AzureBlobFolderArray{ AzureBlobFolderArgs{...} }
type AzureBlobFolderArrayInput interface {
	pulumi.Input

	ToAzureBlobFolderArrayOutput() AzureBlobFolderArrayOutput
	ToAzureBlobFolderArrayOutputWithContext(context.Context) AzureBlobFolderArrayOutput
}

type AzureBlobFolderArray []AzureBlobFolderInput

func (AzureBlobFolderArray) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*AzureBlobFolder)(nil)).Elem()
}

func (i AzureBlobFolderArray) ToAzureBlobFolderArrayOutput() AzureBlobFolderArrayOutput {
	return i.ToAzureBlobFolderArrayOutputWithContext(context.Background())
}

func (i AzureBlobFolderArray) ToAzureBlobFolderArrayOutputWithContext(ctx context.Context) AzureBlobFolderArrayOutput {
	return pulumi.ToOutputWithContext(ctx, i).(AzureBlobFolderArrayOutput)
}

// AzureBlobFolderMapInput is an input type that accepts AzureBlobFolderMap and AzureBlobFolderMapOutput values.
// You can construct a concrete instance of `AzureBlobFolderMapInput` via:
//
//	AzureBlobFolderMap{ "key": AzureBlobFolderArgs{...} }
type AzureBlobFolderMapInput interface {
	pulumi.Input

	ToAzureBlobFolderMapOutput() AzureBlobFolderMapOutput
	ToAzureBlobFolderMapOutputWithContext(context.Context) AzureBlobFolderMapOutput
}

type AzureBlobFolderMap map[string]AzureBlobFolderInput

func (AzureBlobFolderMap) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*AzureBlobFolder)(nil)).Elem()
}

func (i AzureBlobFolderMap) ToAzureBlobFolderMapOutput() AzureBlobFolderMapOutput {
	return i.ToAzureBlobFolderMapOutputWithContext(context.Background())
}

func (i AzureBlobFolderMap) ToAzureBlobFolderMapOutputWithContext(ctx context.Context) AzureBlobFolderMapOutput {
	return pulumi.ToOutputWithContext(ctx, i).(AzureBlobFolderMapOutput)
}

type AzureBlobFolderOutput struct{ *pulumi.OutputState }

func (AzureBlobFolderOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**AzureBlobFolder)(nil)).Elem()
}

func (o AzureBlobFolderOutput) ToAzureBlobFolderOutput() AzureBlobFolderOutput {
	return o
}

func (o AzureBlobFolderOutput) ToAzureBlobFolderOutputWithContext(ctx context.Context) AzureBlobFolderOutput {
	return o
}

type AzureBlobFolderArrayOutput struct{ *pulumi.OutputState }

func (AzureBlobFolderArrayOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*AzureBlobFolder)(nil)).Elem()
}

func (o AzureBlobFolderArrayOutput) ToAzureBlobFolderArrayOutput() AzureBlobFolderArrayOutput {
	return o
}

func (o AzureBlobFolderArrayOutput) ToAzureBlobFolderArrayOutputWithContext(ctx context.Context) AzureBlobFolderArrayOutput {
	return o
}

func (o AzureBlobFolderArrayOutput) Index(i pulumi.IntInput) AzureBlobFolderOutput {
	return pulumi.All(o, i).ApplyT(func(vs []interface{}) *AzureBlobFolder {
		return vs[0].([]*AzureBlobFolder)[vs[1].(int)]
	}).(AzureBlobFolderOutput)
}

type AzureBlobFolderMapOutput struct{ *pulumi.OutputState }

func (AzureBlobFolderMapOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*AzureBlobFolder)(nil)).Elem()
}

func (o AzureBlobFolderMapOutput) ToAzureBlobFolderMapOutput() AzureBlobFolderMapOutput {
	return o
}

func (o AzureBlobFolderMapOutput) ToAzureBlobFolderMapOutputWithContext(ctx context.Context) AzureBlobFolderMapOutput {
	return o
}

func (o AzureBlobFolderMapOutput) MapIndex(k pulumi.StringInput) AzureBlobFolderOutput {
	return pulumi.All(o, k).ApplyT(func(vs []interface{}) *AzureBlobFolder {
		return vs[0].(map[string]*AzureBlobFolder)[vs[1].(string)]
	}).(AzureBlobFolderOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*AzureBlobFolderInput)(nil)).Elem(), &AzureBlobFolder{})
	pulumi.RegisterInputType(reflect.TypeOf((*AzureBlobFolderArrayInput)(nil)).Elem(), AzureBlobFolderArray{})
	pulumi.RegisterInputType(reflect.TypeOf((*AzureBlobFolderMapInput)(nil)).Elem(), AzureBlobFolderMap{})
	pulumi.RegisterOutputType(AzureBlobFolderOutput{})
	pulumi.RegisterOutputType(AzureBlobFolderArrayOutput{})
	pulumi.RegisterOutputType(AzureBlobFolderMapOutput{})
}
