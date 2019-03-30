const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const db = require('./models/db')();
const app = express();
const port = process.env.PORT || 4200;

// server init
app.listen(port, () => console.log('Server listening at http://localhost:4200'));
app.use(express.static(`${__dirname}/controllers`));
app.use(express.static(`${__dirname}/styles`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET/POST
app.get('/', (req, res) => res.redirect('/index'));
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

app.post('/create', async (req, res) => res.send(await create(req.body.table, req.body.options)));
app.post('/select', async (req, res) => res.send(await select(req.body.table, req.body.options)));
app.post('/update', async (req, res) => res.send(await update(req.body.table, req.body.values, req.body.options)));
app.post('/destroy', async (req, res) => res.send(await destroy(req.body.table, req.body.options)));

// use to format dd-mm-yyyy
app.post('/moment', (req, res) => {
    const dates = {};
    for (const date in req.body.dates) dates[date] = moment(req.body.dates[date], 'dd-mm-yyyy').format('x');
    res.send(dates);
});

// query functions
async function create(table, values) {
    if (!table) return;
    if (!values) return;
    console.log('yes')
    return await db[table].create(values).catch(e => console.error(e));
}

async function select(table, options) {
    if (!table) return;
    if (!options) options = {};
    if (options.limit === 1) return await db[table].findOne(options);
    else return await db[table].findAll(options);
}

async function update(table, values, options) {
    if (!table) return;
    if (!values) return;
    if (!options) options = {};
    return await db[table].update(values, options);
}

async function destroy(table, options) {
    if (!table) return;
    if (!options) options = {};
    return await db[table].destroy(options);
}