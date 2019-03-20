const Sequelize = require('sequelize');
module.exports = async () => {
    const sequelize = new Sequelize('projectscherm', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });
    // sequelize
    //     .authenticate()
    //     .then(() => {
    //         console.log('Connection has been established successfully.');
    //     })
    //     .catch(err => {
    //         console.error('Unable to connect to the database:', err);
    //     });
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
            validate: { is: ["[a-z]",'i'] },
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
            validate: { is: ["[a-z]",'i'] },
            allowNull: false
        },
        password: { type: Sequelize.STRING },
        teams: { type: Sequelize.STRING }
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
        startDate: { type: Sequelize.INTEGER },
        endDate: { type: Sequelize.INTEGER },
        delay: { type: Sequelize.INTEGER },
        description: { type: Sequelize.STRING },
        lastUpdate: { type: Sequelize.INTEGER }
    });
    return {
        teams: await teams.sync(),
        managers: await managers.sync(),
        projects: await projects.sync()
    };
};