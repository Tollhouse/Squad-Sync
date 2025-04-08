const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("courses")
    .select("*")
    .then((course) => res.status(200).json(course))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/", async (req, res) => {
  const { course_name, date_start, date_end, cert_granted } = req.body
  if(
      isNaN(Date.parse(date_start)) || typeof date_start !== "string" ||
      isNaN(Date.parse(date_end)) || typeof date_end !== "string" ||
      course_name.trim() == "" || typeof course_name !== "string" ||
      cert_granted.trim() == "" || typeof cert_granted !== "string"
  ){
      return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
      try{
          const course_input = await knex("courses")
          .insert({ course_name, date_start, date_end, cert_granted })
          .returning("*")
          res.status(201).json(course_input)
      }catch (error){
          return res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (typeof id !== 'number' || isNaN(id)) {
      res.status(400).json({ error: 'Must include id of the course to update if updating from this endpoint' });
      return
  }
  try{
      const { course_name, date_start, date_end, cert_granted } = req.body;
      const updates = { course_name, date_start, date_end, cert_granted };
      Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

      const updated_course = await knex("courses")
      .where('id',id)
      .update(updates)
      res.status(201).json(updated_course)
  }catch (error){
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of a course.' })
    return
  } else{
      const user = await knex("courses").where('id',id).del()
      res.status(200).json({message: "Course successfully deleted."})
  }
});

module.exports = router;