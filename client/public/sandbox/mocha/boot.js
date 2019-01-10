// Taken from https://gist.github.com/255kb/63c8d218c9c34e39c919fb4cdecce559
function iFrameReporter(runner) {
  Mocha.reporters.Base.call(this, runner);
  var index = 0;
  var passes = 0;
  var failures = 0;

  runner.on('pass', function(test){
    index++;
    passes++;
    log('[pass]', test.title);
    postMessage({
      type: 'test-pass',
      title: test.title,
      index: index-1
    })
  });

  runner.on('fail', function(test, err){
    index++;
    failures++;
    log('[fail] %s(%s)', test.title, err.message);
    var trace = printStackTrace({ e: err });
    postMessage({
      type: 'test-fail',
      title: test.title,
      index: index-1,
      message: err.message,
      stackTrace: trace
    })
  });

  runner.on('end', function(){
    log('end: %d/%d', passes, passes + failures);
    postMessage({ type: 'end' });
  });
}
mocha.reporter(iFrameReporter, {});
mocha.setup('bdd');

function log () {
  postMessage({
    type: 'console',
    args: Array.prototype.slice.call(arguments)
  })
}
