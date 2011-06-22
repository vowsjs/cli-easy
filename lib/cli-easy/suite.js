/**
 * Cli-Easy
 *
 * Core submodule
 */

var vows = require('vows'),
    CLIeasy = require('../cli-easy');

var core = exports;

/**
 * Create Test suite
 */
function describe(text) {
  return new Suite(text);
};
core.describe = describe;

/**
 * Suite @constructor
 */
function Suite(text) {
  /**
   * Store cliPath for later usage
   */
  this.suite = vows.describe(text);

  /**
   * A batches array
   */
  this.batches = [];

  return new CLIeasy.Batch(this);
};
core.Suite = Suite;

/**
 * Add batch to vows suite
 */
Suite.prototype.next = function(batch) {
  this.batches.push(batch);
  this.suite.addBatch(batch);
  return new CLIeasy.Batch(this);
};

/**
 * Export suite to object
 */
Suite.prototype.export = function(obj) {
  this.suite.export(obj);
};
