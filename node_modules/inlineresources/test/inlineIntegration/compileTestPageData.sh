#!/bin/bash
#
# Downloads a full page from a given URL including all assets and bundles the
# local copy in a .tar.bz

downloadPage() {
    local pageUrl="$1"
    local targetDirectory="$2"

    local wgetOptionsAllowRobots="-e robots=off --wait 0.25 --limit-rate=80k"
    local wgetOptionsFullPage="-E -k -p --span-hosts"

    echo "Downloading full page from ${pageUrl}"
    wget --no-verbose $wgetOptionsAllowRobots $wgetOptionsFullPage --directory-prefix="$targetDirectory" "$pageUrl"
}

tarPage() {
    local sourceDirectory="$1"
    local targetDirectory="$2"
    local testReference="$3"
    local targetTar="${targetDirectory}/${testReference}.tar.bz"

    echo "Taring and gzipping full page into ${targetTar}"
    tar -cjf "$targetTar" "$sourceDirectory"
}

usage() {
    local base=$(basename "$0")
    echo "Usage: $base PAGE_URL TEST_REFERENCE"
    echo
    echo "Example:"
    echo "  $base http://twitter.com twitter"
}

main() {
    local pageUrl="$1"
    local testReference="$2"
    local downloadsDir="./build/tests/downloads"
    local pageDownloadDir="${downloadsDir}/${testReference}"

    if [[ -z "$testReference" ]]; then
        usage
        exit 1
    fi

    mkdir -p "$downloadsDir"
    mkdir -p "$pageDownloadDir"

    downloadPage "$pageUrl" "$pageDownloadDir"
    tarPage "$pageDownloadDir" "$downloadsDir" "$testReference"

    echo "DONE"
}

main $@
