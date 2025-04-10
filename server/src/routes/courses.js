const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);

router.get("/", (req, res) => {
  knex("courses")
    .select(
      '*',
      knex.raw(`TO_CHAR(date_start, 'YYYY-MM-DD') AS date_start`),
      knex.raw(`TO_CHAR(date_end, 'YYYY-MM-DD') AS date_end`)
    )
    .then((course) => res.status(200).json(course))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  if(typeof id !== "number" || isNaN(id)){
      res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of course.' })
      return
  } else{
      const course = await knex("courses")
                                .select(
                                  '*',
                                  knex.raw(`TO_CHAR(date_start, 'YYYY-MM-DD') AS date_start`),
                                  knex.raw(`TO_CHAR(date_end, 'YYYY-MM-DD') AS date_end`)
                                ).
                                where('id',id)
      if (course.length == 0) {
        return res.status(200).json({message: `No matching course found for id: ${id}.`})
      }
      res.status(200).json(course)
  }
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
              .returning("id")
          const query = await knex('courses')
                                    .select(
                                      '*',
                                      knex.raw(`TO_CHAR(date_start, 'YYYY-MM-DD') AS date_start`),
                                      knex.raw(`TO_CHAR(date_end, 'YYYY-MM-DD') AS date_end`)
                                    )
                                    .where('id', course_input[0].id)
          res.status(201).json(query)
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
      if (Object.keys(updates).length == 0) {
        return res.status(400).json({error: 'Must include at least one valid field to patch'})
      }

      const updated_course = await knex("courses")
                                      .where('id',id)
                                      .update(updates)
                                      .returning("id")
      const query = await knex('courses')
                                    .select(
                                      '*',
                                      knex.raw(`TO_CHAR(date_start, 'YYYY-MM-DD') AS date_start`),
                                      knex.raw(`TO_CHAR(date_end, 'YYYY-MM-DD') AS date_end`)
                                    )
                                    .where('id', updated_course[0].id)
      res.status(201).json(query)
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
      res.status(201).json({message: "Course successfully deleted."})
  }
});

router.get("/roster/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if(typeof id !== "number" || isNaN(id)){
    res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of a course.' })
    return
  }
  try{
      let courseRoster = await knex("users")
      .join('course_registration', 'users.id', 'user_id')
      .join('courses', 'courses.id', 'course_id')
      .select('users.id as user_id','first_name','last_name','course_registration.id as registration_id' ,'course_id','course_name', 'cert_granted', 'date_start', 'date_end')
      .select(knex.raw(`'courses' as source`))
      .where('course_id', id)
      .orderBy('users.id');
      if (courseRoster.length == 0) {
        return res.status(200).json({message: `Either course roster is empty for course id: ${id}, or course id: ${id} does not exist`})
      }
      return res.status(200).json(courseRoster)
  }
  catch (error){
      return res.status(500).json({ error: error });
  }

});

module.exports = router;