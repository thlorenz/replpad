var mkdirp     =  require('mkdirp')
  , fs         =  require('fs')
  , path       =  require('path')
  , request    =  require('request')
  , log        =  require('../../log')
  , paths      =  require('../../../config/paths')
  , utl        =  require('../../utl')
  , caches     =  paths.caches
  , dox        =  {};
  
if (!utl.existsSync(caches)) mkdirp(caches);

function downloadDoc(url, mdl, docPath, cb) {
  request(url, function (err, res, body) {
    if (err) return cb(err);
    if (res.statusCode === 404) return cb(new Error('Documentation at [' + url + '] not found.'));

    try {
      dox[mdl] = JSON.parse(body);
    } catch (err) {
      return cb(err);
    }
    cb(null, dox[mdl]);

    // Write file after returning module to minimize wait time
    fs.writeFile(docPath, body, 'utf-8', function (err) {
      if (err) log.error(err);
    });
  });
}

module.exports = function retrieveDoc(url, mdl, cb) {
  var docPath = path.join(caches, mdl + '.json');
  try {
    dox[mdl] = dox[mdl] || require(docPath);
    cb(null, dox[mdl]);
  } catch (err) {
    downloadDoc(url, mdl, docPath, cb);
  }
};
