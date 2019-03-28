const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./models/db')();
const app = express();
const port = process.env.PORT || 4200;

// server init
app.listen(port, () => console.log('Server listening at http://localhost:4200'));
app.use(express.static(__dirname + '/controllers'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET/POST
app.get('/:path', (req, res) => {
    if (req.params.path.includes('.')) {
        req.params.path = (() => {
            const parts = req.params.path.split(/\.+/g);
            if (parts[parts.length-1].toLowerCase().trim() === 'html') parts.pop();
            return parts.join('.');
        })();
    }
    const url = path.join(`${__dirname}/views/${req.params.path}.html`);
    if (fs.existsSync(url)) res.sendFile(url);
    else res.send('404 Page not found');
});

app.post('/create', async (req, res) => {
    const data = await create(req.body.table, req.body.values);
    res.send(data);
});

app.post('/select', async (req, res) => {
    const data = await select(req.body.table, req.body.options);
    res.send(data);
});

app.post('/update', async (req, res) => {
    const data = await update(req.body.table, req.body.values, req.body.options);
    res.send(data);
});

app.post('/destroy', async (req, res) => {
    const data = await destroy(req.body.table, req.body.options);
    res.send(data);
});


// query functions
async function create(table, values) {
    if (!table) return;
    if (!values) return;
    return await db[table].create(values).then(res => res);
}

async function select(table, options) {
    if (!table) return;
    if (!options) options = {};
    return await db[table].findOne(options).then(res => res);
}

async function update(table, values, options) {
    if (!table) return;
    if (!values) return;
    if (!options) options = {};
    return await db[table].update(values, options).then(res => res);
}

async function destroy(table, options) {
    if (!table) return;
    if (!options) options = {};
    return await db[table].destroy(options);
}