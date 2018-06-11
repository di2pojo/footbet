
require('./api/config/config'); 
require('./global_functions');

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const models = require("./api/models");

const userRoutes = require('./api/routes/user');
const tournamentRoutes = require('./api/routes/tournament');

models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:', CONFIG.db_name, err);
});

models.Tournament.hasMany( models.TournamentTeam, { as: 'teams', foreignKey : 'tournamentTeam' } );
models.TournamentTeam.belongsTo(models.Tournament, {foreignKey : 'tournamentTeam'});
models.Tournament.hasMany( models.TournamentMatch, { as: 'matches', foreignKey : 'tournamentMatch' } );
models.TournamentMatch.belongsTo(models.Tournament, {foreignKey : 'tournamentMatch'});

models.sequelize
.sync({
    force: true
}).then(() => {
    models.User.findOne({
        where: {
            username: "admin"
        }
    }).then((admin) => {
        if (!admin){
            models.User.create({
                username: "admin",
                first: "Johan",
                last: "Polheimer",
                email: "johan@polheimer.com",
                password: "test"
            })
        }
    })
})

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/user", userRoutes);
app.use("/tournament", tournamentRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;