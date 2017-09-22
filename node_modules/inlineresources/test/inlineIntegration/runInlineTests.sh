#!/bin/bash
#
# Runs a characterisation test against a list of web pages. This test protects
# the library against unwanted changes to existing behaviour and at the same
# time integrates against web pages in the wild.
#
# Each page is inlined with all its assets and a checksum is calculated for
# the resulting page. This checksum is then matched against a previously
# derived checksum. A mismatch can indicate both an intentional or unwanted
# change in the inlining algorithm.

failedTests=0

exitOnFail() {
    if [[ "$?" -ne 0 ]]; then
        echo "Internal error"
        exit 1
    fi
}

testFile() {
    local sourceFile="$1"
    local testReference="$2"
    local inlinedFilePath="build/tests/${testReference}.xhtml"
    local fileTargetSha="test/inlineIntegration/checksums/${testReference}_sha.txt"

    echo "Generating inlined version of ${sourceFile}"
    slimerjs examples/bundlePage.js "$sourceFile" > "$inlinedFilePath"

    echo "Comparing checksum of file with target"
    checksum=$(shasum "$inlinedFilePath" | cut -d' ' -f1)
    echo "$checksum" | diff - "$fileTargetSha" > /dev/null
    if [[ "$?" -ne 0 ]]; then
        local expected=$(cat "$fileTargetSha")
        echo "Expected ${expected} but got ${checksum}"
        let "failedTests++"
        echo "FAIL"
    else
        echo "SUCCESS"
    fi
}

takeScreenshot() {
    local testReference="$1"
    local inlinedFilePath="build/tests/${testReference}.xhtml"
    local dateSuffix=$(date +%y%m%d_%H%M%S)
    local screenshotPath="build/tests/${testReference}_${dateSuffix}.png"

    echo "Taking a screenshot, writing to ${screenshotPath}"
    echo "file://$(pwd)/$inlinedFilePath"
    slimerjs test/inlineIntegration/rasterize.js "file://$(pwd)/$inlinedFilePath" "$screenshotPath"
    exitOnFail
}

downloadPageData() {
    local testReference="$1"
    local targetDirectory="$2"
    local pageDataUrl="http://cburgmer.github.io/inlineresources/testData/${testReference}.tar.bz"

    if [[ ! -d "${targetDirectory}/${testReference}" ]]; then
        echo "Downloading full page from ${pageDataUrl}"
        wget --directory-prefix="$targetDirectory" "$pageDataUrl"
        exitOnFail
        tar -xjf "${targetDirectory}/${testReference}.tar.bz"
        exitOnFail
    fi
}

runTest() {
    local testReference="$1"
    local relativeLocalPageUrl="$2"
    local downloadsDir="./build/tests/downloads"

    mkdir -p "$downloadsDir"

    echo "Testing against ${testReference}"
    downloadPageData "${testReference}" "${downloadsDir}"
    testFile "${downloadsDir}/${testReference}/${relativeLocalPageUrl}" "${testReference}"
    takeScreenshot "$testReference"
}

main() {
    runTest "github" "github.com/index.html"
    # Flaky, doesn't always terminate
    #runTest "twitter" "twitter.com/index.html"

    if [[ "$failedTests" -eq 0 ]]; then
        echo "DONE"
        exit 0
    else
        echo "${failedTests} failing tests"
        exit 1
    fi
}

main
