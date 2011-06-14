/**
 * Cli-Easy
 *
 * Test suite
 */
var vows = require('vows'),
    assert = require('assert');

var CLIeasy = require('../lib/cli-easy');

var Suite;

vows.describe('Cli-easy').addBatch({
  'CLIeasy.describe()': {
    topic: function() {
      return CLIeasy.describe('node');
    },
    'should return CLIeasy.Suite instance': function(_Suite) {
      assert.instanceOf(_Suite, CLIeasy.Suite);
      Suite = _Suite;
    }
  }
}).export(module);
