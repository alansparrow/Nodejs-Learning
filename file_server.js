var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;
console.log(root);

var server = http.createServer(function(req, res) {
    var url = parse(req.url);
    console.log(url.pathname);
    
    if (url.pathname !== '/favicon.ico') {
        var path = join(root, url.pathname);

        try {
            var stream = fs.createReadStream(path);
            stream.on('data', function(chunk) {
                res.write(chunk); 
                console.log(chunk);
            });
            stream.on('end', function() {
                res.end(); 
            });
        } catch (err) {
            console.log(err.toString());   
        }
    }
});

server.listen(8000);