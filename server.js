const http = require('http');
const fs = require('fs');
const url = require('url');
let db;
fs.readdir('./init_files', (err, files) => {
    if (err) console.error(err);
    files.forEach(async file => {
        const init = require(`./init_files/${file}`);
        const res = await init.execute();
        if (init.name === 'dbinit') {
            for (const table in res) await res[table].sync();
            db = res;
        }
    });
});

function onRequest(request, response) {
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
        response.end();
    });
}

http.createServer(onRequest).listen(4200, () => console.log('Listening on port 4200'));