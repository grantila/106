#!/bin/bash

set -e

node_modules/.bin/rimraf dist
mkdir dist

node_modules/.bin/tsc -p .

node_modules/.bin/rimraf dist-es6
mkdir dist-es6

node_modules/.bin/tsc -p . -t esnext -m commonjs --outDir dist-es6

node_modules/.bin/rollup dist-es6/browser.js --format cjs --output dist-browser.js
node_modules/.bin/rollup dist-es6/node.js --format cjs --output dist-node.js
