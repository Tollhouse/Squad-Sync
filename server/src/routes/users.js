const cors = require('cors');
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);
router.use(express.json())
router.use(cors())

router.get("/", (req, res) => {
    knex("users")
      .select("*")
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json({ error: err.message }));
  });

router.get('/users', async (req, res) => {
    res.status(200).json({message:"Working route."})
});

router.get("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    if(typeof id !== "number" || isNaN(id)){
       return res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of user.' })
    }
    try{
      const user = await knex("users")
      .join("crews", "users.crew_id", '=', "crews.id")
      .select("users.id", "users.user_name", "users.first_name", "users.last_name", "users.crew_id", "users.role", "users.experience_type", "crews.crew_name")
      .where("users.id", id).first()
      if(!user) {
        return res.status(404).json({ error: 'User not found.' })
      }
      res.status(200).json(user)
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error'})
    }
});

router.post("/users", async (req, res) => {
    const { user_name, first_name, last_name, password, crew_id, role, experience_type } = req.body
    if(
        user_name.trim() == "" || typeof username !== "string" ||
        first_name.trim() == "" || typeof first_name !== "string" ||
        last_name.trim() == "" || typeof last_name !== "string" ||
        password.trim() == "" || typeof password !== "string" ||
        typeof crew_id !== "number" ||
        role.trim() == "" || typeof role !== "string" ||
        experience_type == "" || typeof experience_type !== "string"
    ){
        return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
    }else{
        try{
            const user_input = await knex("users")
            .insert({user_name, first_name, last_name, password, crew_id, role,experience_type})
            .returning("*")
            res.status(200).json(user_input)
        }catch (error){
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.patch("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number' || isNaN(id)) {
        res.status(400).json({ error: 'Must include id of employee to update if updating from this endpoint' });
        return
    }
    try{
        const { user_name, first_name, last_name, password, squadron_id, crew_id, role, experience_type } = req.body;
        const updates = {user_name, first_name, last_name, password, squadron_id, crew_id, role, experience_type};
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const updated_user = await knex("users")
        .where('id',id)
        .update(updates)
        res.status(201).json(updated_user)
    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/users/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    if(typeof id !== "number" || isNaN(id)){
        res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of user.' })
        return
    } else{
        const user = await knex("users").where('id',id).del()
        res.status(200).json({message: "User successfully deleted."})
    }
});

module.exports = router;