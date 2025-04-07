const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("course_registration")
    .select("*")
    .then((courseRegistration) => res.status(200).json(courseRegistration))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;