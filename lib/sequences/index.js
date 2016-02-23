"use strict";

module.exports = function( logger )
{
	var exporter = { };
	exporter.Sequence  = require( './sequence' )( logger );
	exporter.Sequencer = require( './sequencer' )( exporter.Sequence );
	return exporter;
};
