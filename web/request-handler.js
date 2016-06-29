var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers')
// require more modules/folders here!

exports.paths = {
  index: path.join(__dirname, './public/index.html')
};

exports.handleRequest = function (req, res) {
  var headers = httpHelpers.headers;
  if(req.url === '/'){
    var statusCode = 200;
    res.writeHead(statusCode, headers);

    console.log('serving index');
    httpHelpers.serveAssets(res, exports.paths.index, function(data){
      res.end(data);
      //console.log(data);
    });
  }







  //testing helper function
  archive.readListOfUrls(function(data) {
    console.log(data);
  });





};

