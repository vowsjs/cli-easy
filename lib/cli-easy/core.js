/**
 * Cli-Easy
 *
 * Core submodule
 */

var core = exports;

/**
 * Create Test suite
 */
function describe(cliPath) {
  return new Suite(cliPath);
};
core.describe = describe;

function Suite(cliPath) {
};
core.Suite = Suite;
