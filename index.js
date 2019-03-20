const http = require('http');
const fs = require('fs');
const url = require('url');
const db = require('./init_files/db')();


function onRequest(request, response) {
    let path = url.parse(request.url).pathname;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    if (path === '/') {
        fs.readFile('./views/index.html', null, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.write('Page not found');
            } else response.write(data);
            response.end();
        });
    } else {
        if (path.includes('.')) {
            path = (() => {
                const parts = path.split(/\.+/g);
                if (parts[parts.length-1].toLowerCase().trim() === 'html') parts.pop();
                return parts.join('.');
            })();
        }
        fs.readFile(`./views${path}.html`, null, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.write('Page not found');
            } else response.write(data);
            response.end();
        });
    }
}

http.createServer(onRequest).listen(4200, () => console.log('Listening on port 4200'));