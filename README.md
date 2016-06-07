# 106

### Log library with sequences and colors, for node.js and browsers

# Synopsis

The numbers 106 are shaped like the word "log", but I assume you already got that.

There are lots of log libraries out there, but this one has two main targets:

 * Working the same in browsers and node.js
 * Support for sequences (flows)

When any kind of asynchronous operation take place, log lines get interleaved. This applies to server-side as well as client-side, and is the result of asynchrony per se.

To follow logs and see what lines are part of a certain code flow (a client-side outgoing call, or a server-side incoming request, e.g.), the concept of unique tags (or "sequences") help out a lot. Consider an HTTP server getting a request, performing multiple asynchronous tasks (like database operations) and then responding back. All things which get logged here, will be interleaved with other requests.

You also have the possibility to add your own custom transports (e.g. to automatically send log errors from the browser to the server).

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

## Custom transports

To add a custom transport, you create your own callback function, and call `addTransport( )` on the logger. You can also set your own log-level using the second (optional) argument, so that this transport only get certain logs.

```js
var logger = require( '106' );
var log = logger( 'foo' );

function customTransport( logData )
{
    logData.level;             // The log level, 'info', 'warn', etc
    logData.messages;          // The message parts (as an array)
    logData.errror;            // The error object, if that was the last
                               // argument.
    logData.meta;              // The last argument to log() if it's an
                               // object or array, and not covered by a '%s'.
    logData.prefix;            // The prefix ('foo' in this example)
    logData.sequence;          // The sequence (or null)
    logData.sequenceDirection; // The sequence direction (or null)
    logData.time;              // The time (as a javascript Date object)
    logData.timestamp;         // The time as an ISO-formatted string
}

// Forward error logs to "customTransport"
logger.addTransport( customTransport, { level: 'warn' } );

log.error( "This will be sent to the custom logger" );
log.warn( "And this" );
log.info( "But this won't" );
```
