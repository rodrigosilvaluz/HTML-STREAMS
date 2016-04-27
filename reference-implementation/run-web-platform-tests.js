// This runs the web platform tests against the reference implementation, in Node.js using jsdom, for easier rapid
// development of the reference implementation and the web platform tests.
'use strict';
const path = require('path');
const wptRunner = require('wpt-runner');

const { ReadableStream } = require('./lib/readable-stream.js');
const { WritableStream } = require('./lib/writable-stream.js');
const ByteLengthQueuingStrategy = require('./lib/byte-length-queuing-strategy.js');
const CountQueuingStrategy = require('./lib/count-queuing-strategy.js');

const testsPath = path.resolve(__dirname, 'web-platform-tests/streams');

wptRunner(testsPath, setup)
  .then(failures => process.exit(failures))
  .catch(e => {
    console.error(e.stack);
    process.exit(1);
  });

function setup(window) {
  window.ReadableStream = ReadableStream;
  window.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
  window.CountQueuingStrategy = CountQueuingStrategy;
}
