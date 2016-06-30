var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var headers = httpHelpers.headers;
  if(req.url === '/'){
    var statusCode = 200;
    res.writeHead(statusCode, headers);

    if (req.method === 'POST') {
      var data = ''
      req.on('data', function(chunk) {
        data += chunk;
      }).on('end', function() {
        data = data.substr(4);

        archive.addUrlToList(data, function() {
          res.writeHead(302, headers);
          res.end();
        })

      })
    } else {

      console.log('serving index');
      httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data){
        res.end(data);
      });
    }
  } else{
    httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url), function(data){
      var statusCode = 200;
      res.writeHead(statusCode, headers);
      res.end(data);
      console.log('archived site sent back');
    });
  }






};

