const db = (async () => await require('../models/db'))();
db.projects.findOne({ where: { id: 1 } }).then(res => console.log(res));