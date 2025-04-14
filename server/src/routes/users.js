const cors = require("cors");
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile")["development"]);
router.use(express.json())
router.use(cors())
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    // const saltRounds = 12;
    const saltRounds = 2;
    return await bcrypt.hash(password, saltRounds);
};

router.get("/", (req, res) => {
    knex("users")
      .select("*")
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json({ error: err.message }));
});

// router.get('/', async (req, res) => {
//     res.status(200).json({message:"Working route."})
// });


router.get("/schedule", async (req, res) => {
    let data = []

    try{
        let courseDates = await knex("users")
        .join('course_registration', 'users.id', 'user_id')
        .join('courses', 'courses.id', 'course_id')
        .select('users.id as user_id','first_name','last_name','course_registration.id as registration_id' ,'course_id','course_name', 'cert_granted', 'date_start', 'date_end')
        .select(knex.raw(`'courses' as source`))
        .orderBy('users.id');

        let crewDates = await knex("users")
        .join('crews', 'users.crew_id', 'crews.id')
        .join('crew_rotations', 'crews.id', 'crew_rotations.crew_id')
        .select('users.id as user_id','first_name', 'last_name','crews.id as crew_id', 'crew_name','crew_rotations.id as rotation_id','shift_type',  'date_start', 'date_end')
        .select(knex.raw(`'crews' as source`))
        .orderBy('users.id');

        data.push({crewDates})
        data.push({courseDates})

        return res.status(200).json(data)
    }
    catch (error){
        return res.status(500).json({ error: error });
    }
});

// get route to get the schedule of a specific user
router.get("/schedule/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    let data = []

    try{
        let courseDates = await knex("users")
        .join('course_registration', 'users.id', 'user_id')
        .join('courses', 'courses.id', 'course_id')
        .select('users.id as user_id','first_name','last_name','course_registration.id as registration_id' ,'course_id','course_name', 'cert_granted', 'date_start', 'date_end')
        .select(knex.raw(`'courses' as source`))
        .orderBy('course_id')
        .where('users.id', id);

        let crewDates = await knex("users")
        .join('crews', 'users.crew_id', 'crews.id')
        .join('crew_rotations', 'crews.id', 'crew_rotations.crew_id')
        .select('users.id as user_id','first_name', 'last_name','crews.id as crew_id', 'crew_name','crew_rotations.id as rotation_id','shift_type',  'date_start', 'date_end', 'shift_duration', 'role')
        .select(knex.raw(`'crews' as source`))
        .orderBy('rotation_id')
        .where('users.id', id);

        data.push({crewDates})
        data.push({courseDates})

        return res.status(200).json(data)
    }
    catch (error){
        return res.status(500).json({ error: error });
    }

});

router.get("/certification", async (req, res) => {
    const course_reg = await knex("users")
    .join("course_registration", "users.id", "course_registration.user_id")
    .join("courses", "course_registration.course_id", "courses.id")
    .select("*")
    .where('course_registration.cert_earned', true)
    if (course_reg.length === 0) {
        return res.status(200).json([])
    }
    res.status(200).json(course_reg)
});


router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    if(typeof id !== "number" || isNaN(id)){
       return res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of user.' })
    }
    try{
        const user = await knex("users")
        .join("crews", "users.crew_id", '=', "crews.id")
        .select("users.id", "users.user_name", "users.first_name", "users.last_name", "users.crew_id", "users.role", "users.experience_type", "users.privilege", "crews.crew_name")
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

router.post("/", async (req, res) => {
    const { user_name, first_name, last_name, password, crew_id, role, experience_type } = req.body;

    if (
        typeof user_name !== "string" || user_name.trim() === "" ||
        typeof first_name !== "string" || first_name.trim() === "" ||
        typeof last_name !== "string" || last_name.trim() === "" ||
        typeof password !== "string" || password.trim() === "" ||
        typeof crew_id !== "number" ||
        typeof role !== "string" || role.trim() === "" ||
        typeof experience_type !== "string" || experience_type.trim() === ""
      ) {
        return res.status(400).json({ message: 'Submitted information is in the invalid format.' });
    }else{
        try{
            const hashedPassword = await hashPassword(password);
            knex('users')
                .where('user_name', user_name)
                .first()
                .then(foundUser => {
                if (foundUser) {
                    return res.status(404).json('Username already exists.')
                } else {
                    return knex('users')
                        .insert({first_name, last_name, user_name, password: hashedPassword, crew_id, role, experience_type, privilege: 'user', flight: 'DOO'}, ['id', 'privilege'])
                        .then((newUser) => {
                            return res.status(201).json({id: newUser[0].id, privilege: newUser[0].privilege, message: `Welcome ${first_name}, your username is ${user_name}.`})
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json('Error creating user. Error: ' + err)
                        })
                }
                })
        }catch (error){
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.post('/login', (req, res) => {
    const {user_name, password} = req.body;
    if (typeof user_name != 'string' || user_name.trim() == '' ||
        typeof password != 'string' || password.trim() == '')
    {
        return res.status(400).json({error: 'Please provide a non-empty username and password.'})
    }

    knex('users')
    .select('*')
    .where('user_name', user_name)
    .then(user => {
      if (user.length == 0) {
        return res.status(404).json({ error: 'User not found.'})
      } else {
        return bcrypt.compare(password, user[0].password)
        .then((matches) => {
          return matches == true
                  ? res.status(200).json({
                    message: 'Login successful',
                    user: {id: user[0].id,
                    user_name: user[0].user_name,
                    privilege: user[0].privilege}})
                  : res.status(401).json({ error: 'Password is incorrect.'})
        })
      }})
    .catch((err) => {
      return res.status(500).json({message: 'Unable to get login information.', error: err})
    })
})

router.patch("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (typeof id !== 'number' || isNaN(id)) {
        res.status(400).json({ error: 'Must include id of employee to update if updating from this endpoint' });
        return
    }
    try{
        const { user_name, first_name, last_name, squadron_id, crew_id, role, experience_type, privilege, flight } = req.body;
        const updates = {user_name, first_name, last_name, squadron_id, crew_id, role, experience_type, privilege, flight};

        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);
        if (Object.keys(updates).length == 0) {
            return res.status(400).json({error: 'Must include at least one valid field to patch'})
        }

        const updated_user = await knex("users")
        .where('id',id)
        .update(updates)
        .returning("*")
        res.status(201).json(updated_user)
    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    if(typeof id !== "number" || isNaN(id)){
        res.status(400).json({ error: 'Invalid or missing request field. ID must match an id of user.' })
        return
    } else{
        const user = await knex("users").where('id',id).del()
        res.status(201).json({message: "User successfully deleted."})
    }
});

module.exports = router;
