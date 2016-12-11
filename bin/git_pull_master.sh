#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

mms_vendor_dir=$PWD/"$CURRENT_DIR/../vendor/mms"
if [ $# -lt 1 ]; then
    branch=master
else
    branch=$1
fi


for dir in `ls $mms_vendor_dir`;
do
    echo "Moving to $dir"
    cd "$mms_vendor_dir/$dir"
    git pull origin master
done
#If error with bad interpreter show run sed -i -e 's/\r$//' bin/deploy.sh