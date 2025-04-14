const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("course_registration")
    .select("*")
    .then((courseRegistration) => res.status(200).json(courseRegistration))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/:id", async (req, res) => {
  const user_id = parseInt(req.params.id)
  if(typeof user_id !== "number" || isNaN(user_id)){
      res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of couse registration.' })
      return
  } else{
      const course_reg = await knex("course_registration").select("*").where('user_id', user_id)
      if (course_reg.length == 0) {
        return res.status(200).json([])
      }
      res.status(200).json(course_reg)
  }
});

router.post("/", async (req, res) => {
  const { user_id, course_id, in_progress, cert_earned } = req.body
  if(
      typeof user_id !== "number" ||
      typeof course_id !== "number" ||
      in_progress.trim() == "" || typeof in_progress !== "string" ||
      typeof cert_earned !== "boolean"
  ){
      return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
  }else{
      try{
          const course_input = await knex("course_registration")
          .insert({ user_id, course_id, in_progress, cert_earned })
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
      const { user_id, course_id, in_progress, cert_earned } = req.body;
      const updates = { user_id, course_id, in_progress, cert_earned };
      Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
      if (Object.keys(updates).length == 0) {
        return res.status(400).json({error: 'Must include at least one valid field to patch'})
      }

      const updated_course = await knex("course_registration")
      .where('id',id)
      .update(updates)
      .returning("*")
      res.status(201).json(updated_course)
  }catch (error){
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of a user registered for this course.' })
    return
  } else{
      const course_reg = await knex("course_registration").where('id',id).del()
      res.status(201).json({message: "Course registration successfully deleted."})
  }
});

module.exports = router;