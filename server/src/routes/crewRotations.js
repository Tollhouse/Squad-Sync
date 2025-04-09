const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("crew_rotations")
    .select("*")
    .then((crewRotation) => res.status(200).json(crewRotation))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
      res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of crew rotation.' })
      return
  } else{
      const rotation = await knex("crew_rotations").select("*").where('id',id)
      res.status(200).json(rotation)
  }
});

router.post("/", async (req, res) => {
  const { crew_id, date_start, date_end, shift_type, shift_duration, experience_type } = req.body
  if(
      isNaN(Date.parse(date_start)) || typeof date_start !== "string" ||
      isNaN(Date.parse(date_end)) || typeof date_end !== "string" ||
      shift_type.trim() == "" || typeof shift_type !== "string" ||
      typeof shift_duration !== "number" ||
      typeof crew_id !== "number" ||
      experience_type == "" || typeof experience_type !== "string"
  ){
      return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
      try{
          const user_input = await knex("crew_rotations")
          .insert({crew_id, date_start, date_end, shift_type, shift_duration, experience_type})
          .returning("*")
          res.status(201).json(user_input)
      }catch (error){
          return res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (typeof id !== 'number' || isNaN(id)) {
      res.status(400).json({ error: 'Must include id of the crew rotation to update if updating from this endpoint' });
      return
  }
  try{
      const { crew_id, date_start, date_end, shift_type, shift_duration, experience_type } = req.body;
      const updates = { crew_id, date_start, date_end, shift_type, shift_duration, experience_type };
      Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

      const updated_crew = await knex("crew_rotations")
      .where('id',id)
      .update(updates)
      res.status(201).json(updated_crew)
  }catch (error){
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of a crew rotation.' })
    return
  } else{
      const user = await knex("crew_rotations").where('id',id).del()
      res.status(201).json({message: "Crew Rotation successfully deleted."})
  }
})

module.exports = router;