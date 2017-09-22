#!/bin/bash
set -e

installDependencies() {
    npm install
}

build() {
    ./node_modules/.bin/grunt $@
}

runIntegrationTest() {
    ./node_modules/.bin/slimerjs test/phantomIntegrationTest.js
}

main() {
    if [ ! -d node_modules ]; then
        installDependencies
    fi

    build
    runIntegrationTest | tee /tmp/go.$$
    # Sadly slimerjs cannot return errorcodes
    cat /tmp/go.$$ | grep success
}

main
