var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
  getTitles(res);
}).listen(8000);

function getTitles(res) {
  fs.readFile('./titles.json', function(err, data) {
    if (err) {
      hadError(err, res);
    }
    else {
      console.log(data.toString());
      getTemplate(JSON.parse(data.toString()), res);
    }
  });
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', function(err, data) {
    if (err) {
      hadError(err, res);
    }
    else {
      formatHtml(titles, data.toString(), res);
    }
  });
}

function formatHtml(titles, tmpl, res) {
  var html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
}

function hadError(err, res) {
  console.error(err);
  res.end('Server error');
}
