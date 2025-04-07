const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("crew_rotations")
    .select("*")
    .then((crewRotation) => res.status(200).json(crewRotation))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;