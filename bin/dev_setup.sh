#!/bin/bash

CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

ARTISAN="php $CURRENT_DIR/../artisan"

cinfo "Clearing cache"
$ARTISAN cache:clear
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Clearing configuration cache"
$ARTISAN config:clear
check_errs $? ${BASH_SOURCE[0]} $LINENO

cinfo "Clearing routes cache"
$ARTISAN route:clear
check_errs $? ${BASH_SOURCE[0]} $LINENO

#If error with bad interpreter show run sed -i -e 's/\r$//' bin/deploy.sh
