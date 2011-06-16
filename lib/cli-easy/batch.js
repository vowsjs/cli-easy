/**
 * Cli-Easy
 *
 * Batch
 */

var CLIEasy = require('../cli-easy'),
    assert = require('assert'),
    exec = require('child_process').exec;

var batch = exports;

/**
 * Batch @constructor
 */
function Batch(suite) {
  this._suite = suite;

  /**
   * Init properties
   */
  this._cmd = null;
  this._args = [];

  /**
   * Create a batch history
   * That will allow us to return to previous batch
   * on .undiscuss() call
   */
  this._rootBatch = this._batch = {};
  this._batchHistory = {
    current: this._batch,
    args: this._args
  };

  /**
   * Save a reference for previous batchHistory state
   * so we can simply go back when `undiscuss` is called
   */
  this._batchHistory.previous = this._batchHistory;

  return this;
};
batch.Batch = Batch;

/**
 * Setup CLI location and default arguments (better use arg() for that)
 */
Batch.prototype.use = function(cmd) {
  this._cmd = cmd;
  return this;
};

/**
 * Add argument to args hierarchy
 * Calling .discuss() will be copy `args` to sub-batch
 * And calling .undiscuss() will return it to previous state
 * (Even if it was changed with .arg() in sub-batch)
 */
Batch.prototype.arg = function(arg) {
  this._batchHistory.args.push(arg || '');
  return this;
};

/**
 * Add topic to current (or root) vow
 */
Batch.prototype.run = function(args, options) {
  var cmd = this._cmd;

  /**
   * by default, options = {}
   */
  options || (options = {});

  args = this._batchHistory.args.concat(args || '');

  this._batch.topic = function() {
    var callback = this.callback;
    /**
     * Execute defined command with arguments and passed options
     */
    exec([cmd].concat(args).join(' '), onExec);

    /**
     * Combine results in one object and pass them to callback
     * Add err to result, because we want it to be a part of
     * test assertions
     */
    function onExec(err, stdout, stderr) {
      var result = {
        err: err,
        stdout: stdout,
        stderr: stderr
      };
      callback(null, result);
    };
  };

  return this;
};

/**
 * Add text to batch
 */
Batch.prototype.discuss = function(text) {
  /**
   * Create new batch history state
   * and a sub-section in `this._batch`
   * Copy args from parent
   */
  this._batchHistory = {
    current: this._batch = this._batch[text] ||
                           (this._batch[text] = {}),
    args: [].concat(this._batchHistory.args),
    previous: this._batchHistory
  };

  return this;
};

/**
 * Pop out from sub-batch to parent
 * (Does nothing for root batch)
 */
Batch.prototype.undiscuss = function() {
  this._batchHistory = this._batchHistory.previous;
  this._batch = this._batchHistory.current;

  return this;
};

/**
 * Add a batch to suite and return a new one
 */
Batch.prototype.next = function() {
  return this._suite.next(this._rootBatch);
};

/**
 * Export suite to some object
 * (Vows .export() method wrapper)
 */
Batch.prototype.export = function(obj) {
  this._suite.next(this._rootBatch);
  this._suite.export(obj);
};

/**
 * Add test assertion
 */
Batch.prototype.expect = function(text, stdout, err) {
  /**
   * In case std is:
   * String - Check if result is equal to std
   * RegExp - Check if result.match(std) != null
   * Function - call it and assert that return value will be true
   * Other - Check if result is empty
   */
  function assertStd(result, std) {
    if (typeof std === 'string' || typeof std === 'number') {
      assert.equal(result && result.code || result, std);
    } else if (std instanceof RegExp) {
      assert.isNotNull(result.match(std),
                       'Expected value to match following regexp: ' +
                       std + ', but got: ' + result);
    } else if (typeof std === 'function') {
      assert.ok(std(result));
    } else {
      if (typeof result !== 'string' && result !== null) {
        assert.equal(result.code, 0);
      }
    }
  };

  this._batch[text] = function(result) {
    assertStd(result.stdout, stdout);
    assertStd(typeof err === 'number' ? result.err :
                                        result.stderr,
              err);
  };
  return this;
};
