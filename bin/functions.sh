#!/bin/bash

check_errs()
{
    # Function. Parameter 1 is the return code
    # Para. 2 is text to display on failure.
    if [ "${1}" -ne "0" ]; then
        cwarn "\nERROR # ${1} : ${2} at ${3}\n"
        # as a bonus, make our script exit with the right error code.
        exit ${1}
    fi
}

# Display colorized information output
function cinfo() {
 COLOR='\033[01;33m' # bold yellow
 RESET='\033[00;00m' # normal white
 MESSAGE=${@:-"${RESET}Error: No message passed"}
 echo -e "${COLOR}${MESSAGE}${RESET}"
}
 
# Display colorized warning output
function cwarn() {
 COLOR='\033[01;31m' # bold red
 RESET='\033[00;00m' # normal white
 MESSAGE=${@:-"${RESET}Error: No message passed"}
 echo -e "${COLOR}${MESSAGE}${RESET}"
}
 
# Display colorized error output
function cerror() {
 COLOR='\033[01;31m' # bold red
 RESET='\033[00;00m' # normal white
 MESSAGE=${@:-"${RESET}Error: No message passed"}
 echo -e "${COLOR}${MESSAGE}${RESET}"
}

#Random password generator
genpasswd() {
 local l=$1
        [ "$l" == "" ] && l=16
       tr -dc A-Za-z0-9_ < /dev/urandom | head -c ${l} | xargs
}
