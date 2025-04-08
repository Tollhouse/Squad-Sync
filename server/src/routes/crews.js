const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("crews")
    .select("*")
    .then((crew) => res.status(200).json(crew))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/", async (req, res) => {
  const { crew_name } = req.body
  if(crew_name.trim() == "" || typeof crew_name !== "string"){
    return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
    try{
      const user_input = await knex("crews")
      .insert({crew_name})
      .returning("*")
      res.status(201).json(user_input)
    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

router.patch("/:id", async (req, res) => {
  const { crew_name } = req.body
  if(crew_name.trim() == "" || typeof crew_name !== "string"){
    return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
    try{
      const user_input = await knex("crews")
      .where('id',id)
      .update({crew_name})
      .returning("*")
      res.status(200).json(user_input)
    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
})

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of crew.' })
    return
  } else{
      const user = await knex("crews").where('id',id).del()
      res.status(201).json({message: "Crew successfully deleted."})
  }
});

module.exports = router;