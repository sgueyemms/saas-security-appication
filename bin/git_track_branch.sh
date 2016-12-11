#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

mms_vendor_dir=$PWD/"$CURRENT_DIR/../vendor/mms"
if [ $# -lt 1 ]; then
    cerror "Syntax: command new-branch form-branch"
    exit 1
fi
branch=$1

for dir in `ls $mms_vendor_dir`;
do
    echo "Moving to $dir"
    cd "$mms_vendor_dir/$dir"
    if git rev-parse -q --verify $branch >/dev/null; then
        cwarn "Branch '$branch' already exists"
    else
        git checkout --track origin/$branch
    fi
done