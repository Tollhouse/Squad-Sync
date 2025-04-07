//Boiler plate setup
const express = require('express');
const app = express();
const port = 8080;

app.use(express.json())

//Basic home route - UPDATE LATER
app.get('/', (req, res) => res.send('Hello World!'))

//Console message confirming Express is up and running.
app.listen(port, () => console.log(`Express servers is listening at http://localhost:${port}`))

module.exports = app