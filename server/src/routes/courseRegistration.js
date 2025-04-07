const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

module.exports = router;