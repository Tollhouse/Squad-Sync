const cors = require('cors');
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);
router.use(express.json())
router.use(cors())

router.get('/users', async (req, res) => {
    res.status(200).json({message:"Working route."})
})

router.get("/", (req, res) => {
  knex("users")
    .select("*")
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json({ error: err.message }));
});


module.exports = router;