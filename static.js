/**
 * Created by Rober on 05/05/15.
 */

var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var root = __dirname;
var items = [];

var server = http.createServer(function(req, res) {
    var url = parse(req.url);
    var path = join(root, url.pathname);
    var url = parse(req.url);
    var path = join(root, url.pathname);

    if ('/' == req.url) {
        switch (req.method) {
            case 'GET':
                show(res);
                break;
            case 'POST':
                add(req, res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }

    /*fs.stat(path, function (err, stat) {
        if (err) {
            if ('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        } else {
            res.setHeader('Content-Length', stat.size);
            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            });
        }
    });*/
});

server.listen(3000);

function show(res) {
    var html = '<html><head><title>Todo List</title></head><body>'
        + '<h1>Todo List</h1>'
        + '<ul>'
        + items.map(function(item){
            return '<li>' + item + '</li>'
        }).join('')
        + '</ul>'
    + '<form method="post" action="/">'
    + '<p><input type="text" name="item" /></p>'
    + '<p><input type="submit" value="Add Item" /></p>'
    + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}
var qs = require('querystring');
function add(req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ body += chunk });
    req.on('end', function(){
        var obj = qs.parse(body);
        items.push(obj.item);
        show(res);
    }); }