#!/bin/bash

xvfb-run -a -s "-screen 0 595x842x16" /usr/bin/wkhtmltopdf $*

