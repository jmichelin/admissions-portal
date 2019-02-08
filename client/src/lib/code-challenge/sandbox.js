/* eslint-disable */
//
// Runs code in a webworker sandbox.
//
var EXECUTION_TIMEOUT = 10000;
//
// export type SandboxData = any
// export type SandboxError = any
// type Callback = (sandbox: Sandbox, data: SandboxData, error: SandboxError) => void

export function run (code, callback) {
  var box = new Sandbox({
    timeout: EXECUTION_TIMEOUT,
    url: '/sandbox/sandbox.html',
    scripts: [
      '/sandbox/stacktrace.js',
      '/sandbox/chai.js',
      '/sandbox/mocha/mocha.js',
      '/sandbox/mocha/boot.js',
      'data:application/javascript,' + encodeURIComponent(code),
    ],
    callback: callback
  })
  sandboxes[box.id] = box
  count++
  box.run()
  return box
}

//
// The iframe sandbox innards
//
var alphanumeric = 'abcdefghijklmnopqrstuvwxyz';
alphanumeric += alphanumeric.toUpperCase();
alphanumeric += '0123456789';

var post = post_to_queue;
var sandboxes = {};
var count = 0;
var frame = null;
var queue = [];

var sandBoxDefaults = {
  timeout: 0,
  url: '/sandbox/sandbox.html',
  scripts: () => [],
  callback: function(sb, data, error) {
    return true;
  }
}

// type SandboxOptions = {
//   timeout: number
//   url: string
//   scripts: string[]
//   callback: Callback
// }
export class Sandbox {

  options;
  id;
  state;

  constructor(options) {
    this.options = Object.assign({}, sandBoxDefaults, options || {});
    this.id = generate_id();
    this.state = 'init';
  }

  callback(data, error) {
    return this.options.callback(this, data, error);
  }

  post(command, options) {
    return post(JSON.stringify({
      id: this.id,
      command: command,
      options: options
    }));
  }

  run() {
    if (this.state !== 'init') {
      return;
    }
    count++;

    load_frame(this.options.url);

    this.post('run', {
      scripts: this.options.scripts,
      timeout: this.options.timeout
    });
    return this.state = 'running';
  }

  terminate() {
    if (this.state !== 'running') {
      return;
    }
    this.post('terminate');
    this.state = 'terminated';
    delete sandboxes[this.id];
    return count--;
  }

}

function generate_id () {
  var i, id, _i;
  id = '';
  for (i = _i = 1; _i <= 16; i = ++_i) {
    id += alphanumeric[Math.floor(alphanumeric.length * Math.random())];
  }
  return id;
}
function post_to_queue (message) {
  return queue.push(message);
}
function post_to_frame (message) {
  return frame && frame.contentWindow.postMessage(message, '*');
}
function messageHandler (e) {
  try {
    var data = JSON.parse(e.data);
  }
  catch (err) {
    // Sometimes 3rd party messages come through. Ignore them.
    console.warn("Ignored message:", e.data)
    return
  }

  if ( data == undefined ) {
    return
  }

  if ( data.data === '__terminate__' ) {
    return sandboxes[data.id] && sandboxes[data.id].callback(data.error, data.data)
  }
  if ( data.error === 'timeout' ) {
    // Normalize data structure for running callback
    data.data = { type: 'timeout' }
    delete data.error
  }

  if (data.id in sandboxes) {
    // Run callback
    return sandboxes[data.id].callback(data.error, data.data);
  }
}
function load_frame (url) {
  if (frame) {
    return;
  }
  frame = document.createElement('iframe')

  frame.src = url

  frame.style.position = 'absolute'
  frame.style.top = '-9999px'
  frame.style.left = '-9999px'
  frame.style.width = 100
  frame.style.height = 10

  document.body.appendChild(frame)

  return frame.addEventListener('load', function() {
    window.addEventListener('message', messageHandler)
    post = post_to_frame;

    var q = queue;
    queue = [];

    var results = [];
    for (var i = 0; i < q.length; i++) {
      var message = q[i];
      results.push(post(message));
    }
    return results;
  });
}
function unload_frame () {
  if (!frame) {
    return;
  }
  if (count > 0) {
    return;
  }
  window.removeEventListener('message', messageHandler)
  post = post_to_queue;
  frame.unbind().remove();
  return frame = null;
}
