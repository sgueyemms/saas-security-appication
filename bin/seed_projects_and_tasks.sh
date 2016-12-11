#!/bin/bash
CURRENT_DIR=$(dirname ${BASH_SOURCE[0]})

. $CURRENT_DIR/functions.sh

ARTISAN="php $CURRENT_DIR/../artisan"

$ARTISAN app:dev test_seed_tags
$ARTISAN app:dev test_seed_projects
$ARTISAN app:dev test_seed_tasks
