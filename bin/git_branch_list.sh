#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

mms_vendor_dir=$PWD/"$CURRENT_DIR/../vendor/mms"



for dir in `ls $mms_vendor_dir`;
do
    echo "Moving to $dir"
    cd "$mms_vendor_dir/$dir"
    branch=$(git symbolic-ref --short HEAD)
    echo "    $branch"
done