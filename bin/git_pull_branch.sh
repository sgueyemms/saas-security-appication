#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

mms_vendor_dir=$PWD/"$CURRENT_DIR/../vendor/mms"
if [ $# -lt 1 ]; then
    cerror "Syntax command branch"
    exit 1
fi
branch=$1

for dir in `ls $mms_vendor_dir`;
do
    echo "Moving to $dir"
    cd "$mms_vendor_dir/$dir"
    #Check if branch exists in remote
    git pull origin $branch
done