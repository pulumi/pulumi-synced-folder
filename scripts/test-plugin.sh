#!/bin/bash

set -euo pipefail

# Utility script that tests a locally built plugin using one or more examples.

# Remove and reinstall the plugin.
pulumi plugin rm resource synced-folder --yes
pulumi plugin install resource synced-folder $(pulumictl get version) -f $(pwd)/bin/pulumi-resource-synced-folder --reinstall

# Put the plugin on the PATH (so programs can use it).
export PATH="$(pwd)/bin:$PATH"

# Test synced-folder-aws-yaml.
pushd examples/synced-folder-aws-yaml

    # Clean up
    pulumi destroy --yes --remove || true

    # Create, configure, deploy.
    pulumi stack init dev
    pulumi config set aws:region us-west-2
    pulumi up --yes

    # Test.
    aws s3 ls "s3://$(pulumi stack output bucketName)/index.hstml" || (echo "Synced file not found" && exit 1)

    # Clean up.
    pulumi destroy --yes --remove

popd
