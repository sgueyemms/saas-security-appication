#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

mms_vendor_dir=$PWD/"$CURRENT_DIR/../vendor/mms"
tag=$1

for dir in `ls $mms_vendor_dir`;
do
    cd "$mms_vendor_dir/$dir"
    if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
        echo "Tag already exists"
    else
        git tag $tag
    fi
    git push origin -u --tags
done