const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const temp = require('templatesjs');
const moment = require('moment');
const { generate, verify } = require('password-hash');
const db = require('./models/db');
const app = express();
const port = process.env.PORT || 4200;

// server init
app.listen(port, () => console.log('Server listening at http://localhost:4200'));
app.use(express.static(`${__dirname}/controllers`));
app.use(express.static(`${__dirname}/styles`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'khalid is niet wit',
    resave: true,
    saveUninitialized: true
}));

// GET/POST
app.get('/', (req, res) => res.redirect('/index'));
app.get('/:path', (req, res) => {
    if (!['index', 'login', 'overview'].includes(req.params.path) && !req.session.user) return res.redirect('/login');
    if (req.params.path.match(/manager-+/) && !req.session.user.isAdmin) return res.sendFile(`${__dirname}/views/unauthorized.html`);
    else if (req.params.path.match(/team-+/) && req.session.user.isAdmin) return res.sendFile(`${__dirname}/views/unauthorized.html`);
    if (req.params.path.includes('.')) {
        req.params.path = (() => {
            const parts = req.params.path.split(/\.+/g);
            if (parts[parts.length-1].toLowerCase().trim() === 'html') parts.pop();
            return parts.join('.');
        })();
    }
    const url = path.join(`${__dirname}/views/${req.params.path}.html`);
    if (fs.existsSync(url)) {
        fs.readFile(url, (err, data) => {
            if (err) throw err;
            const output = temp.setSync(data);
            res.end(output);
        });
    }
    else res.send('404 Page not found');
});

app.post('/create', async (req, res) => res.send(await create(req.body.table, req.body.options)));
app.post('/select', async (req, res) => res.send(await select(req.body.table, req.body.options)));
app.post('/update', async (req, res) => res.send(await update(req.body.table, req.body.values, req.body.options)));
app.post('/destroy', async (req, res) => res.send(await destroy(req.body.table, req.body.options)));

// use to format dd-mm-yyyy
app.post('/moment', (req, res) => {
    const dates = {};
    for (const date in req.body.dates) dates[date] = moment(req.body.dates[date], 'dd-mm-yyyy').format('yyyy-mm-dd');
    console.log(dates);
    res.send(dates);
});

// use to hash passwords
app.post('/hash', (req, res) => res.send(generate(req.body.password)));

// use to verify passwords
app.post('/verify', (req, res) => {
    const verified = verify(req.body.password, req.body.hash);
    if (verified) req.session.user = { id: req.body.id, isAdmin: req.body.table === 'managers' };
    res.send(verified);
});

app.post('/send-session', (req, res) => res.send(req.session.user));
app.post('/save-id', (req, res) => {
    req.session.user.savedId = req.body.id;
    res.end();
});
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send(true);
});

// query functions
async function create(table, values) {
    if (!table) return;
    if (!values) return;
    return await db[table].create(values).catch(e => console.error(e));
}

async function select(table, options) {
    if (!table) return;
    if (!options) options = {};
    if (options.limit === 1) return await db[table].findOne(options).catch(e => console.error(e));
    else return await db[table].findAll(options).catch(e => console.error(e));
}

async function update(table, values, options) {
    if (!table) return;
    if (!values) return;
    if (!options) options = {};
    return await db[table].update(values, options).catch(e => console.error(e));
}

async function destroy(table, options) {
    if (!table) return;
    if (!options) options = {};
    const result = await db[table].destroy(options).catch(e => console.error(e));
    return `${result} rows affected`;
}