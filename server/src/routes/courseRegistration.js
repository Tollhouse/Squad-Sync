const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("course_registration")
    .select("*")
    .then((courseRegistration) => res.status(200).json(courseRegistration))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/course_registration", async (req, res) => {
  const { user_id, course_id, in_progress, cert_earned } = req.body
  if(
      typeof user_id == "number" ||
      typeof course_id == "number" ||
      in_progress.trim() == "" || typeof in_progress !== "string" ||
      cert_earned.trim() == "" || typeof cert_earned !== "string"
  ){
      return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
      try{
          const course_input = await knex("course_registration")
          .insert({ user_id, course_id, in_progress, cert_earned })
          .returning("*")
          res.status(200).json(course_input)
      }catch (error){
          return res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

router.patch("/course_registration/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (typeof id !== 'number' || isNaN(id)) {
      res.status(400).json({ error: 'Must include id of the course to update if updating from this endpoint' });
      return
  }
  try{
      const { user_id, course_id, in_progress, cert_earned } = req.body;
      const updates = { user_id, course_id, in_progress, cert_earned };
      Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

      const updated_course = await knex("course_registration")
      .where('id',id)
      .update(updates)
      res.status(201).json(updated_course)
  }catch (error){
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/course_registration/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of a user registered for this course.' })
    return
  } else{
      const user = await knex("course_registration").where('user_id',id).del()
      res.status(200).json({message: "Course registration successfully deleted."})
  }
});

module.exports = router;