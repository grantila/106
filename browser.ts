'use strict';

import Sequence from './lib/sequences/sequence'
import Sequencer from './lib/sequences/sequencer'
import browserLogger from './lib/logger-browser.js'

import lib, { Logger } from './lib/index'

const _glob = < any >global;
const loggerInstance =
	_glob.__106_instance__
	? _glob.__106_instance__
	: browserLogger( );

_glob.__106_instance__ = loggerInstance;

const logger = lib( loggerInstance );

export { logger }
export * from './lib/index'

export default logger;
