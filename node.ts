'use strict';

import Sequence from './lib/sequences/sequence'
import Sequencer from './lib/sequences/sequencer'
import nodeLogger from './lib/logger-node.js'

import lib, { Logger } from './lib/index'
import * as extra from './lib/index'

const _glob = < any >global;
const loggerInstance =
	_glob.__106_instance__
	? _glob.__106_instance__
	: nodeLogger( );

_glob.__106_instance__ = loggerInstance;

const logger = lib( loggerInstance );
for ( const key of Object.keys( extra ) )
	logger[ key ] = extra[ key ];

( < any >logger ).default = logger;
( < any >logger ).logger = logger;

export = logger;
