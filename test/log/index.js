
var timekeeper = require('timekeeper');

var log = require('../../')('test');
var Sequencer = require('../../').Sequencer;

describe('general', function() {
	it('should be able to log to info', function() {
		log.info("hello world", 1, false, {}, null, undefined, {thisIs:'meta'});
	});

	it('should be handle sequences', function() {
		var sequence1 = new Sequencer( 'foo' );
		var sequence2 = new Sequencer( 'bar' );

		function printStuff( sequence )
		{
			for (var i = 0; i < 5; ++i)
			{
				var seq = sequence.next( );
				log.info( seq, Sequencer.IN, "incoming request" );
				log.info( seq, "test" );
				log.warn( seq, "test" );
				log.error( seq, "test" );
				if ( i % 2 )
					log.info( seq, Sequencer.OUT, "outgoing request" );
				else
					log.error( seq, Sequencer.OUTERR, "outgoing request" );
			}
		}

		printStuff( sequence1 );
		printStuff( sequence2 );
	});

	it('should be handle timed out sequences', function( done ) {
		var sequencer = new Sequencer( 'timer', { timeout: 5 } );
		var seq = sequencer.next( );

		log.info( seq, Sequencer.IN, "incoming request" );
		log.info( seq, "test" );
		setTimeout( function( )
		{
			log.info( seq, Sequencer.OUT, "outgoing request" );
			done( );
		}, 10 );
	});

	it('should be handle sequences lasting very long', function( ) {
		var sequencer = new Sequencer( 'timer' );

		// ms delay
		var sequences = [
			[ 500, +0 ],
			[ 900, +0 ],
			[ 1100, +0 ],
			[ 9900, +0 ],
			[ 10100, +0 ],
			[ 1000, 60, -50 ],
			[ 1000, 60, +0 ],
			[ 1000, 60, +50 ],
			[ 1000, 60, 60, -50 ],
			[ 1000, 60, 60, +50 ],
			[ 1000, 60, 60, 24, -50 ],
			[ 1000, 60, 60, 24, +50 ],
			[ 1000, 60, 60, 24, 25, -50 ],
			[ 1000, 60, 60, 24, 25, +50 ]
		];

		sequences.forEach( function( seqdiff ) {
			var now = new Date( );
			timekeeper.freeze( now );

			var msdiff = seqdiff.pop( );
			var msg = seqdiff.join(' * ') + " +" + msdiff;

			var diff = seqdiff.reduce( function( last, cur ) {
				return last * cur;
			}, 1 );
			diff += msdiff;

			var seq = sequencer.next( );
			log.info( seq, Sequencer.IN, "IN with %s", msg );

			now.setTime( now.getTime( ) + diff );
			timekeeper.travel( now );

			log.info( seq, Sequencer.OUT, "OUT", diff );
		} );

		timekeeper.reset( );
	});
});
