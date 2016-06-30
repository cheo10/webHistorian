var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'), //our index.html, etc location
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if(err) console.log(err);
    data = data.trim().split('\n');
    callback(data);
  });
};

exports.isUrlInList = function(site, callback) {
  exports.readListOfUrls(function(data) {
    data.indexOf(site) === -1 ? callback(false) : callback(true);
  })
};

exports.addUrlToList = function(site, callback) {
  exports.isUrlInList(site, function(is){
    if(!is){
      fs.appendFile(exports.paths.list, site + '\n', function(err){
        if(err) console.log(err);
        callback();
        console.log('URL added!')
      });
    }
  });
};

exports.isUrlArchived = function(site, callback) {
  fs.access(exports.paths.archivedSites + '/' + site, fs.W_OK, function(err){
    err ? callback(false) : callback(true)
  });
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(element){
    exports.isUrlArchived(element, function(is){
      if(!is){
        fs.mkdir(exports.paths.archivedSites + '/' + element, function(err){
          if(err) {
            console.log('Error: ', err);
          } else {
            var file = fs.createWriteStream(exports.paths.archivedSites + '/' + element + '/data.html');
            console.log('writing file')
            http.get('http://' + element, function(response) {
              console.log('getting http')
              response.pipe(file);
            })
          }

        });

      }
    })
  });
};
