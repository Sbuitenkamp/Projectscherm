const Sequelize= require('sequelize');
const { dbName, host, user, pw } = require('../config.json');
let tables;
(async () => {
    const sequelize = new Sequelize(dbName, user, pw, {
        host,
        dialect: 'mysql',
        logging: false
    });
    sequelize.authenticate()
        .then(() => {
            console.log('DB connection sucessful.');
        })
        .catch(async () => {
        });
    const teams = sequelize.define('teams', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        managerId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        username: {
            type: Sequelize.STRING,
            validate: { is: ['[a-z]', 'i'] },
            allowNull: false
        },
        password: { type: Sequelize.STRING },
        members: { type: Sequelize.STRING }
    });
    const managers = sequelize.define('managers', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            validate: { is: ['[a-z]', 'i'] },
            allowNull: false
        },
        password: { type: Sequelize.STRING },
    });
    const projects = sequelize.define('projects', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        managerId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        teamId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        projectName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        startDate: { type: Sequelize.DATEONLY },
        endDate: { type: Sequelize.DATEONLY },
        delay: { type: Sequelize.INTEGER },
        description: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        lastUpdate: { type: Sequelize.INTEGER }
    });
    const tasks = sequelize.define('tasks', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        teamId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        taskName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: { type: Sequelize.STRING },
        isApproved: { type: Sequelize.BOOLEAN }
    });

    tables = {
        teams,
        managers,
        projects,
        tasks
    };

    for (const table in tables) {
        await tables[table].sync();
        console.log(`Loaded ${table} successfully`);
    }

    managers.hasMany(teams, { foreignKey: 'managerId', as: 'teams' });
    managers.hasMany(projects, { foreignKey: 'managerId', as: 'managerProjects' });
    projects.hasOne(teams, { sourceKey: 'teamId', foreignKey: 'id', as: 'teamProject' });
    teams.hasMany(tasks, { foreignKey: 'teamId', as: 'tasks' });
})();

module.exports = tables;