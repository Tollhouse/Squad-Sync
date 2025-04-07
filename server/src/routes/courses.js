const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("courses")
    .select("*")
    .then((course) => res.status(200).json(course))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;