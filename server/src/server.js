//Boiler plate setup
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(expres.json());

//Route setup
const usersRoute = require('./routes/users');
const courseRegistrationRoute = require('./routes/courseRegistration');
const coursesRoute = require('./routes/courses');
const crewsRoute = require('./routes/crews');
const crewRotationsRoute = require('./routes/crewRotations');

app.use('/users', usersRoute);
app.use('/couresRegistration', courseRegistrationRoute);
app.use('/courses', coursesRoute);
app.use('/crews', crewsRoute);
app.use('/crewRotations', crewRotationsRoute);

//Basic home route - UPDATE LATER
app.get('/', (req, res) => res.send('Hello World!'))

//Console message confirming Express is up and running.
const server = app.listen(port, () => console.log(`Express server is listening at http://localhost:${port}`))

module.exports = { app, server, port }