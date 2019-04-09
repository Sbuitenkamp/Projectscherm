const Sequelize = require('sequelize');
module.exports = () => {
    const sequelize = new Sequelize('projectscherm', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
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
            validate: { is: ["[a-z]", 'i'] },
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
            validate: { is: ["[a-z]", 'i'] },
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
    const tables = {
        teams,
        managers,
        projects,
        tasks
    };
    for (const table in tables) {
        tables[table].sync().then(() => console.log(`Loaded ${table} successfully`));
    }

    managers.hasMany(teams, { foreignKey: 'managerId', as: 'teams' });
    managers.hasMany(projects, { foreignKey: 'managerId', as: 'managerProjects' });
    projects.hasOne(teams, { sourceKey: 'teamId', foreignKey: 'id', as: 'teamProject' });
    teams.hasMany(tasks, { foreignKey: 'teamId', as: 'tasks' });

    return tables;
};