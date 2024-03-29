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
        .then(() => console.log('DB connection sucessful.'))
        .catch(e => console.error(e));
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
            allowNull: false,
            unique: true
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
            allowNull: false,
            unique: true
        },
        password: { type: Sequelize.STRING },
        superUser: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
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
            allowNull: false
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

    const requests = sequelize.define('requests', {
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
        taskId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        managerId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        requestedStatus: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        projectId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        description: { type: Sequelize.STRING },
    });

    tables = {
        teams,
        managers,
        projects,
        tasks,
        requests
    };

    for (const table in tables) {
        await tables[table].sync();
        console.log(`Loaded ${table} successfully`);
    }

    managers.hasMany(teams, { foreignKey: 'managerId', as: 'managerTeams' });
    managers.hasMany(projects, { foreignKey: 'managerId', as: 'managerProjects' });
    projects.hasOne(teams, { sourceKey: 'teamId', foreignKey: 'id', as: 'projectTeam' });
    teams.hasMany(tasks, { foreignKey: 'teamId', as: 'teamTasks' });
    teams.hasMany(requests, { foreignKey: 'teamId', as: 'teamRequests' });
})();

module.exports = tables;