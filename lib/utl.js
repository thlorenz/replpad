'use strict';

var path    =  require('path')
  , fs      =  require('fs')
  , util    =  require('util')
  , logFile =  path.join(__dirname, '../logs/debug.log');

exports.shallowClone = function shallowClone(obj) {
  var clone = {};
  Object.keys(obj).forEach(function (k) {
    clone[k] = obj[k];
  });
  return clone;
};

exports.pad = function pad(s, len, padding) {
  len = len || 0;
  padding = padding || ' ';

  return len + 1 >= s.length
    ? s + new Array(len + 1 - s.length).join(padding)
    : s;
};

exports.log = function log(obj, depth) {
  var s = util.inspect(obj, false, depth || 5, true);
  fs.appendFileSync(logFile, s);
};

exports.inspect = function(obj, depth) {
  return util.inspect(obj, false, depth || 5, true);
};

exports.existsSync =  fs.existsSync || path.existsSync;

/**
 * Copies srcFile to tgtFile without checking if paths are valid and calls back when done.
 * srcFile is streamed to tgtFile
 *
 * @name copyFile
 * @function
 * @param srcFile {String}
 * @param tgtFile {String}
 * @param cb {Function} called when file is completely copied or an error occurs
 */
exports.copyFile = function (srcFile, tgtFile, cb) {
  var readStream = fs.createReadStream(srcFile)
    , writeStream = fs.createWriteStream(tgtFile);

  writeStream
    .on('close', cb)
    .on('error', cb);

  readStream
    .on('error', cb);

  readStream.pipe(writeStream);
};


/**
 * Copies srcFile to tgtFile without checking if paths are valid and returns when done.
 * srcFile is copied to tgtFile in chunks
 *
 * @name copyFileSync
 * @function
 * @param srcFile {String}
 * @param tgtFile {String}
 * @return {void}
 */
exports.copyFileSync = function(srcFile, tgtFile) {
  var buflen    =  64 * 1024
    , buf       =  new Buffer(buflen)
    , fdr       =  fs.openSync(srcFile, 'r')
    , fdw       =  fs.openSync(tgtFile, 'w')
    , bytesRead =  1
    , pos       =  0
    ;

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, buf, 0, buflen, pos);
    fs.writeSync(fdw, buf, 0, bytesRead);
    pos += bytesRead;
  }

  fs.closeSync(fdr);
  return fs.closeSync(fdw);
};
