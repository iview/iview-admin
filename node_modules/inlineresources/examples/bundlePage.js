var port = 8000,
    stderr = require("system").stderr;

// https://github.com/ariya/phantomjs/issues/10150
console.error = function () {
    var out = Array.prototype.join.call(arguments, ' ') + '\n';
    try {
        stderr.write(out);
    } catch (e) {
        // SlimerJS 0.9.0 throws an error here: 'JavaScript Error: "stderr is undefined"'
    }
};

var textExtensions = ['html', 'htm', 'css', 'js'];

var isBinaryFile = function (path) {
    var extension;
    if (path.lastIndexOf('.') < 0) {
        return false;
    }

    extension = path.substr(path.lastIndexOf('.') + 1);
    if (textExtensions.indexOf(extension) >= 0) {
        return false;
    }
    return true;
};

var contentTypeMap = {
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript'
};

var guessContentType = function (fileName) {
    var extension;

    if (fileName.lastIndexOf('.') >= 1) {
        extension = fileName.substr(fileName.lastIndexOf('.') + 1);
    }
    return contentTypeMap[extension] || 'text/plain';
};

var startWebserver = function () {
    var fs = require('fs'),
        server = require('webserver').create();

    var launched = server.listen(port, function(request, response) {
        var localPath = '.' + decodeURIComponent(request.url),
            inputStream;

        if (fs.isReadable(localPath)) {
            response.statusCode = 200;
            if (isBinaryFile(request.url)) {
                response.setEncoding('binary');
                inputStream = fs.open(localPath, 'rb');
            } else {
                // Content-Type to work around https://bugzilla.mozilla.org/show_bug.cgi?id=942138
                response.setHeader('Content-Type', guessContentType(localPath));
                inputStream = fs.open(localPath, 'r');
            }
            response.write(inputStream.read());
        } else {
            response.statusCode = 404;
            response.write("");
        }

        response.close();
    });

    if (!launched) {
        window.console.log("Error: Unable to start internal web server on port", port);
        phantom.exit(1);
    }
};

var getBaseName = function (path) {
    if (path.lastIndexOf('/') >= 0) {
        return path.substr(path.lastIndexOf('/') + 1);
    }
    return path;
};

var getFileUrl = function (address) {
    return address.indexOf("://") === -1 ? "http://localhost:" + port + "/" + address : address;
};

var bundlePage = function (url) {
    var page = require('webpage').create(),
        helperPage = getFileUrl('examples/bundlePage.html'),
        pageUrl = getFileUrl(url);

    page.onConsoleMessage = function (msgString) {
        var msg;
        try {
            msg = JSON.parse(msgString);
        } catch (e) {
            console.error("Internal error: Cannot parse message: ", msgString);
            return;
        }

        if (msg.cmd === 'done') {
            console.log(msg.content);
            phantom.exit(0);
        } else if (msg.cmd === 'log') {
            console.error(msg.content);
        } else {
            console.error("Internal error: Unknown command:", msg);
            phantom.exit(1);
        }
    };

    page.open(helperPage, function (status) {
        if (status === "success") {
            page.evaluate(function (pageUrl) {
                bundlePage(pageUrl);
            }, pageUrl);
        } else {
            console.log("Internal error: page did not load: '" + helperPage + "'");
            phantom.exit(1);
        }
    });
};

var main = function () {
    var args = require('system').args,
        pageToInline;

    if (args.length !== 2) {
        console.log('Usage: ' + getBaseName(args[0]) + ' PAGE_TO_INLINE');
        console.log("Inlines resources of a given page into one big XHTML document");
        phantom.exit(1);
    } else {
        pageToInline = args[1];
    }

    startWebserver();
    bundlePage(pageToInline);
};

main();
