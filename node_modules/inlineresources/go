#!/bin/bash
set -e

installDependencies() {
    npm install
}

build() {
    ./node_modules/.bin/grunt $@
}

runCharacterisationTest() {
    PATH=./node_modules/.bin/:$PATH ./test/inlineIntegration/runInlineTests.sh
}

main() {
    if [ ! -d node_modules ]; then
        installDependencies
    fi

    build
    runCharacterisationTest
}

main
