'use strict';

import Sequence from './lib/sequences/sequence'
import Sequencer from './lib/sequences/sequencer'
import browserLogger from './lib/logger-browser.js'

import lib, { Logger } from './lib/index'

const logger = lib( browserLogger( ) );

export { logger }
export * from './lib/index'
