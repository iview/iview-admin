var fs = require('fs'),
    browserify = require('browserify');

desc('Checks the syntax');
task('jshint', {async: true}, function () {
    jake.exec('jshint lib/*.js tests/specs/*.js tests/browserSpecs/*.js', {printStdout: true}, function () {
        complete();
    });
});

desc('Runs the tests against node.');
task('testNode', {async: true}, function () {
    console.log("Testing Node.js integration");
    jake.exec('jasmine-node --captureExceptions tests/specs/', {printStdout: true}, function () {
        complete();
    });
});

desc('Runs the tests against a browser (PhantomJS).');
task('testBrowser', ['browser'], {async: true}, function () {
    console.log("Testing browser integration");
    jake.exec('phantomjs tests/run-jasmine.js tests/SpecRunner.html', {printStdout: true}, function () {
        complete();
    });
});

var distDir = __dirname + '/dist',
    browserBuildTarget = distDir + '/xmlserializer.js';

directory(distDir);

desc('Builds the browser bundle.');
task('browser', [distDir], function () {
    console.log("Building browser bundle in", browserBuildTarget);

    var b = browserify(),
        w = fs.createWriteStream(browserBuildTarget);
    b.add('./lib/serializer.js');
    b.bundle({
        standalone: 'xmlserializer'
    }).pipe(w);
});

task('clean', function () {
    if (fs.existsSync(browserBuildTarget)) {
        fs.unlinkSync(browserBuildTarget);
    }
    if (fs.existsSync(distDir)) {
        fs.rmdirSync(distDir);
    }
});

task('test', ['jshint', 'testNode', 'testBrowser']);

task('default', ['test', 'browser']);
