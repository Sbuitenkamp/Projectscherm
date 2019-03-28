const http = require('http');
const fs = require('fs');
const url = require('url');
const db = require('./models/db')();

async function onRequest(request, response) {
    let path = url.parse(request.url).pathname;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    if (path === '/') loadFile('/index', response);
    else {
        if (path.includes('.')) {
            path = (() => {
                const parts = path.split(/\.+/g);
                if (parts[parts.length-1].toLowerCase().trim() === 'html') parts.pop();
                return parts.join('.');
            })();
        }
        loadFile(path, response);
    }
}

function loadFile(path, response) {
    fs.readFile(`./views${path}.html`, null, (err, data) => {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.write('Page not found');
        } else response.write(data);
        // TODO create post request
        // fs.exists(`./controllers${path}.js`, (exist) => {
        //     if(!exist) {
        //         // if the file is not found, return 404
        //         response.statusCode = 404;
        //         response.end(`File ${path} not found!`);
        //         return;
        //     }
        //     // read file from file system
        //     fs.readFile(`./controllers${path}.js`, (err, data) => {
        //         if(err){
        //             response.statusCode = 500;
        //             response.end(`Error getting the file: ${err}.`);
        //         } else {
        //             response.setHeader('Content-type', 'text/javascript');
        //             response.end(data);
        //         }
        //     });
        // });
        response.end();
    });
}

http.createServer(onRequest).listen(4200, () => console.log('Listening on port 4200'));