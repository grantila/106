'use strict';

import Sequence from './lib/sequences/sequence'
import Sequencer from './lib/sequences/sequencer'
import nodeLogger from './lib/logger-node.js'

import lib, { Logger } from './lib/index'
import * as extra from './lib/index'

const logger = lib( nodeLogger( ) );
for ( const key of Object.keys( extra ) )
	logger[ key ] = extra[ key ];

( < any >logger ).default = logger;
( < any >logger ).logger = logger;

export = logger;
