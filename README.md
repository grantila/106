# 106

### Log library with sequences and colors, for node.js and browsers

# Synopsis

The numbers 106 are shaped like the word "log", but I assume you already got that.

There are lots of log libraries out there, but this one has two main targets:

 * Working the same in browsers and node.js
 * Support for sequences (flows)

When any kind of asynchronous operation take place, log lines get interleaved. This applies to server-side as well as client-side, and is the result of asynchrony per se.

To follow logs and see what lines are part of a certain code flow (a client-side outgoing call, or a server-side incoming request, e.g.), the concept of unique tags (or "sequences") help out a lot. Consider an HTTP server getting a request, performing multiple asynchronous tasks (like database operations) and then responding back. All things which get logged here, will be interleaved with other requests.

# API

The API works the same in the browser as well as in node.js.

## Core logging API

```js
// In lib/foobar.js:
var log = require( '106' )( 'lib:foobar' );

require( '106' ).level = 'debug'; // Sets log level

log.info( "Hello world", { objects: 'are allowed' } );
log.warn( "Warnings with warn()" );
log.error( "Errors with error()", new Error( "doh!" ) );
```

The log levels are:

```
silly
debug
verbose
info
warn
error
```

## Sequences

```js
var logger = require( '106' );
var log = logger( 'server' );
var Sequencer = logger.Sequencer;

// An http server creates a sequencer for incoming HTTP requests
var sequencer = new Sequencer( 'http', { timeout: 5000 } );

// For each incoming request:
var seq = sequencer.next( );

// Start the sequence
log.info( seq, Sequencer.IN, "Got request %s", req.path );

// Pass around 'seq' wherever logging is needed, and prepend it
// to any arguments to log.info, log.warn, log.* ... Example:
log.info( seq, "Querying database for users..." );

// When the request ends successfully (HTTP server replies to client)
log.info( seq, Sequencer.OUT, "Request finished" );
// or if the request chain failed:
var err = new Error( "Could not connect to database" );
log.error( seq, Sequencer.OUTERR, "Request failed", err );
```

All logging using a sequence will print the time since the sequence was created. The output will be:

```
2016-02-24 08:47:08.315 info - server: [seq:http:1] ⇒ Got request /my-path 1ms
2016-02-24 08:47:08.322 info - server: [seq:http:1] Querying database for users... 2ms
2016-02-24 08:47:08.324 info - server: [seq:http:1] ⇐ Request finished 3ms
2016-02-24 08:47:08.324 error - server: [seq:http:1] ⇍ Request failed 4ms
{
    name: "Error",
    message: "Could not connect to database",
    stack: [ ... ]
}
```

The above will be colored, and each sequence will get its own color (circulating between a few pre-defined colors). Again, this applies to node.js as well as browsers!
