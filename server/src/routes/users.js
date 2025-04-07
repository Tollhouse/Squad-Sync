const cors = require('cors');
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.use(express.json())
router.use(cors())

router.get('/users', async (req, res) => {
    res.status(200).json({message:"Working route."})
})

module.exports = router;