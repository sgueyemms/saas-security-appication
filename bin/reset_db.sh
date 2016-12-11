#!/bin/bash
CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

ARTISAN="php $CURRENT_DIR/../artisan"

database_path=$CURRENT_DIR/../database/database.sqlite
if [ -f $database_path ] ; then
    rm $database_path
fi
touch $database_path
check_errs $? ${BASH_SOURCE[0]} $LINENO

$ARTISAN migrate -v
check_errs $? ${BASH_SOURCE[0]} $LINENO

$ARTISAN db:seed -v
check_errs $? ${BASH_SOURCE[0]} $LINENO
