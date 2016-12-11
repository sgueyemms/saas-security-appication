#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

#IF no deployment branch argument is given read one from the env
if [ $# -lt 1 ]; then
    branch=$TARGET_BRANCH
else
    branch=$1
fi

if [ -z "$branch" ]; then
    echo $LINENO
    cerror "No branch provided"
    exit 1
fi
if [ $# -gt 1 ]; then
    run_composer_install=$2
else
    run_composer_install=1
fi
ARTISAN="php $CURRENT_DIR/../artisan"
COMPOSER="composer"

cinfo "Moving to project root directory"
cd $CURRENT_DIR/..
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Going into maintenance mode"
$ARTISAN down
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Checking out '$branch'"
git pull origin $branch
check_errs $? ${BASH_SOURCE[0]} $LINENO

if [ $run_composer_install ]; then
    cinfo "Installing vendor packages"
    $COMPOSER install
    check_errs $? ${BASH_SOURCE[0]} $LINENO
fi

cinfo "Clearing cache"
$ARTISAN cache:clear
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Clearing view cache"
$ARTISAN view:clear
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Clearing twig cache"
$ARTISAN twig:clean
check_errs $? ${BASH_SOURCE[0]} $LINENO


cinfo "Caching configuration"
$ARTISAN config:cache
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Caching routes"
$ARTISAN route:cache
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Going live (reverting maintenance mode)"
$ARTISAN up
check_errs $? ${BASH_SOURCE[0]} $LINENO

#If error with bad interpreter show run sed -i -e 's/\r$//' bin/deploy.sh
