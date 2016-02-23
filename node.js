'use strict';

/* Single-instance check */
if ( global.__log_instance )
{
	exports = module.exports = global.__log_instance;
}
else
{
	var logger = require( './lib/logger-node.js' );
	exports = module.exports = require( './lib' )( logger( ) );
	global.__log_instance = exports;
}
