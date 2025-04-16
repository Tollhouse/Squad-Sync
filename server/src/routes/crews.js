const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("crews")
    .select("*")
    .then((crew) => res.status(200).json(crew))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/schedule", async (req, res) => {

  try{
      let crewSchedule = await knex("crews")
      .leftJoin('crew_rotations', 'crews.id', 'crew_rotations.crew_id')
      .select(
        'crews.id as crew_id','crew_name',
        'crew_rotations.id as rotation_id','shift_type','crew_rotations.experience_type as crew_experience', 'date_start', 'date_end')
        .orderBy("date_start")
        .orderBy("crew_id")

      if (crewSchedule.length == 0) {
        return res.status(200).json({message: `Either course roster is empty for course id: ${id}, or course id: ${id} does not exist`})
      }
      return res.status(200).json(crewSchedule)
  }
  catch (error){
      return res.status(500).json({ error: error });
  }

});

router.get("/schedule/:id", async (req, res) => {
  const id = parseInt(req.params.id)

  try{
      let crewSchedule = await knex("users")
      .join('crews', 'users.crew_id', 'crews.id')
      .join('crew_rotations', 'crews.id', 'crew_rotations.crew_id')
      .select('users.id as user_id','first_name', 'last_name', 'users.experience_type as user_experience',
        'crews.id as crew_id','crew_name',
        'crew_rotations.id as rotation_id','shift_type','crew_rotations.experience_type as crew_experience', 'date_start', 'date_end')
      .where('crews.id', id)


      if (crewSchedule.length == 0) {
        return res.status(200).json({message: `Either course roster is empty for course id: ${id}, or course id: ${id} does not exist`})
      }
      return res.status(200).json(crewSchedule)
  }
  catch (error){
      return res.status(500).json({ error: error });
  }

});

router.get("/roster/:id", async (req, res) => {
  const id = parseInt(req.params.id)

  try{
      let crewSchedule = await knex("users")
      .join('crews', 'users.crew_id', 'crews.id')
      .select('users.id as user_id','first_name', 'last_name', 'role', 'users.experience_type as user_experience', 'crew_name',
        'crews.id as crew_id')
      .where('crews.id', id)


      if (crewSchedule.length == 0) {
        return res.status(200).json({message: `Either course roster is empty for course id: ${id}, or course id: ${id} does not exist`})
      }
      return res.status(200).json(crewSchedule)
  }
  catch (error){
      return res.status(500).json({ error: error });
  }

});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
      res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of crew.' })
      return
  } else{
      const crews = await knex("crews").select("*").where('id',id)
      if (crews.length == 0) {
        return res.status(200).json({message: `No matching crew found with id ${id}.`})
      }
      res.status(200).json(crews)
  }
});

router.post("/", async (req, res) => {
  const { crew_name } = req.body
  if(typeof crew_name !== "string" || crew_name.trim() == ""){
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
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of crew.' })
    return
  }
  const { crew_name } = req.body
  if(typeof crew_name !== "string" || crew_name.trim() == ""){
    return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
    try{
      const user_input = await knex("crews")
        .where('id',id)
        .update({crew_name})
        .returning("*")
      res.status(201).json(user_input)
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