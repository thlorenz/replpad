var fs = require('fs')
  , sax = require('sax')
  , cardinal = require('cardinal');

var moduleName = 'fs';
// TODO: get via async request from: http://nodejs.org/api/fs.json
var json = require('../../test/fixtures/fs.json');

function getModule(json, moduleName) {
  var matches = json.modules.filter(function (x) {
    return x.type === 'module' && x.name === moduleName;
  });
  return matches.length ? matches[0] : null;
}

function getMethod(mod, methodName) {
  var matches = mod.methods.filter(function (x) {
    return x.type === 'method' && x.name === methodName;
  }) ;
  return matches.length ? matches[0] : null;
}

function get(json, moduleName, methodName) {
  var mod = getModule(json, moduleName);
  return mod ? getMethod(mod, methodName) : null;
}

function cleanCode(s) {
  return s.replace(/&#39;/g, '\'');
}

function sections(s) {
  return s.split(/(<p>|<\/>p)/);
}

function presentDesc(desc) {
  // extract text within <p> as is
  // extract text within <code>, unescape (replace &#39; with ') and use color/background for code sections
  return desc;
}

var method = get(json, 'fs', 'readdir');

// TODO: color sections
var present = [];
present.push('\n# ' + method.name + ':\n');
present.push('signature: ' + cardinal.highlight(method.textRaw));
present.push(presentDesc(method.desc));

var s = "<p>Asynchronous file open. See open(2). <code>flags</code> can be:\n\n</p>";
s = 
  "<p>Asynchronous file open. See open(2). <code>flags</code> can be:\n\n</p>" + 
  "<ul>" + 
    "<li><p><code>'r'</code> - Open file for reading.\nAn exception occurs if the file does not exist.</p>\n</li>" +
    "<li><p><code>'r+'</code> - Open file for reading and writing.\nAn exception occurs if the file does not exist.</p>\n</li>\n" + 
    "<li><p><code>'rs'</code> - Open file for reading in synchronous mode. Instructs the operating\nsystem to bypass the local file system cache.</p>\n" + 
      "<p>This is primarily useful for opening files on NFS mounts as it allows you to\nskip the potentially stale local cache. It has a very real impact on I/O\n" + 
        "performance so don't use this mode unless you need it.</p>\n" + 
      "<p>Note that this doesn't turn <code>fs.open()</code> into a synchronous blocking call.\n" + 
        "If that's what you want then you should be using <code>fs.openSync()</code></p>\n</li>\n" + 
    "<li><p><code>'rs+'</code> - Open file for reading and writing, telling the OS to open it\nsynchronously. See notes for <code>'rs'</code> about using this with caution.</p>\n</li>\n" + 
    "<li><p><code>'w'</code> - Open file for writing.\nThe file is created (if it does not exist) or truncated (if it exists).</p>\n</li>\n" + 
    "<li><p><code>'wx'</code> - Like <code>'w'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "<li><p><code>'w+'</code> - Open file for reading and writing.\nThe file is created (if it does not exist) or truncated (if it exists).</p>\n</li>\n" + 
    "<li><p><code>'wx+'</code> - Like <code>'w+'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "<li><p><code>'a'</code> - Open file for appending.\nThe file is created if it does not exist.</p>\n</li>\n" + 
    "<li><p><code>'ax'</code> - Like <code>'a'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "<li><p><code>'a+'</code> - Open file for reading and appending.\nThe file is created if it does not exist.</p>\n</li>\n" + 
    "<li><p><code>'ax+'</code> - Like <code>'a+'</code> but opens the file in exclusive mode.</p>\n</li>\n" + 
    "</ul>\n" + 
    "<p><code>mode</code> defaults to <code>0666</code>. The callback gets two arguments <code>(err, fd)</code>.\n\n</p>\n" + 
    "<p>Exclusive mode (<code>O_EXCL</code>) ensures that <code>path</code> is newly created. <code>fs.open()</code>\n" + 
    "fails if a file by that name already exists. On POSIX systems, symlinks are\n" + 
    "not followed. Exclusive mode may or may not work with network file systems.\n\n</p>\n";
s = s.split('\n').join(' ');

var parser = sax.parser(false);
var tagStack = []
  , currentTag;
parser.onerror = console.error;
parser.ontext = function (t) {
  if (t.trim(' ').length === 0) return;
  console.log('<%s>%s', currentTag.name, t);
};
parser.onopentag = function (tag) {
  currentTag = tag;
  tagStack.push(tag);
};
parser.onclosetag = function (tag) {
  tagStack.pop(tag);
  currentTag = tagStack[tagStack.length - 1] || 'BODY';
};
parser.onattribute = function (node) {
  console.log('att', node);
};
parser.onend = function () {
  console.log('done');
};

parser.write(s).close();
