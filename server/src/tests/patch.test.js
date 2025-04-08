const request = require('supertest')
const { app } = require('../server.js')

let config = require('../../knexfile.js')['development'];
let knex = require('knex')(config);


beforeEach(async () => {
    knex = require('knex')(config);
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
});

afterEach(async () => {
    await knex.destroy();
});

// -------------------------------------------------------  CREW ROTATIONS  -------------------------------------------------------
describe('PATCH testing of /crew_rotations route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).patch('/crew_rotations/bad_request')
        expect(res.status).toBe(400)
    })

    it('incorrect patch body should receive 400 error status', async () => {
        const patch_body = {
            field1: 'this is an incorrect patch body'
        }

        const res = await request(app).patch('/crew_rotations/1').send(patch_body)
        expect(res.status).toBe(400)
    })

    const patch_body = {
        crew_id: 1,
        date_start: "11-29-2018",
        date_end: "11-29-2019",
        shift_type: "rest",
        shift_duration: 12,
        experience_type: 'red'
    }
    it('correct patch body should receive a 201 status', async () => {
        const res = await request(app).patch('/crew_rotations/2').send(patch_body)
        expect(res.status).toBe(201)
    })

    it('returns all fields of patched crew rotation', async () => {
        const res = await request(app).patch('/crew_rotations/2').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        expect(res.body[0].id).toBe(2)
        expect(res.body[0].crew_id).toBe(1)
        expect(res.body[0].date_start).toBe("11-29-2018")
        expect(res.body[0].date_end).toBe("11-29-2019")
        expect(res.body[0].shift_type).toBe("rest")
        expect(res.body[0].shift_duration).toBe(12)
        expect(res.body[0].experience_type).toBe("red")
    })

    it('patched crew rotation is visible in subsequent GET request', async () => {
        let res = await request(app).patch('/crew_rotations/2').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/crew_rotations')
        expect(res.body[res.body.length - 1].crew_id).toBe(1)
        expect(res.body[res.body.length - 1].date_start).toBe("11-29-2018")
        expect(res.body[res.body.length - 1].date_end).toBe("11-29-2019")
        expect(res.body[res.body.length - 1].shift_type).toBe("rest")
        expect(res.body[res.body.length - 1].shift_duration).toBe(12)
        expect(res.body[res.body.length - 1].experience_type).toBe("red")
    })
})

// -------------------------------------------------------  CREWS  -------------------------------------------------------
// describe('PATCH testing of /crews route', () => {
//     it('incorrect body should receive 400 error status', async () => {
//         const patch_body = {
//             field1: 'this is an incorrect post'
//         }

//         const res = await request(app).patch('/crews').send(patch_body)
//         expect(res.status).toBe(400)
//     })

//     const patch_body = {
//         crew_name: 'Test Crew'
//     }
//     it('correct body should receive a 201 status', async () => {
//         const res = await request(app).patch('/crews').send(patch_body)
//         expect(res.status).toBe(201)
//     })

//     it('returns id of created crew', async () => {
//         const res = await request(app).patch('/crews').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//     })

//     it('created crew is visible in subsequent GET request', async () => {
//         let res = await request(app).patch('/crews').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//         res = await request(app).get('/crews')
//         expect(res.body[res.body.length - 1].crew_name).toBe("Test Crew")
//     })
// })

// // -------------------------------------------------------  USERS  -------------------------------------------------------
// describe('PATCH testing of /users route', () => {
//     it('incorrect body should receive 400 error status', async () => {
//         const patch_body = {
//             field1: 'this is an incorrect post'
//         }

//         const res = await request(app).patch('/users').send(patch_body)
//         expect(res.status).toBe(400)
//     })

//     const patch_body = {
//         first_name: 'Bob',
//         last_name: 'The Builder',
//         user_name: 'bbuilder',
//         password: 'yeshecan',
//         crew_id: 2,
//         role: 'Operator',
//         experience_type: 'green'
//     }
//     it('correct body should receive a 201 status', async () => {
//         const res = await request(app).patch('/users').send(patch_body)
//         expect(res.status).toBe(201)
//     })

//     it('returns id of created user', async () => {
//         const res = await request(app).patch('/users').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//     })

//     it('created crew is visible in subsequent GET request', async () => {
//         let res = await request(app).patch('/users').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//         res = await request(app).get('/users')
//         expect(res.body[res.body.length - 1].first_name).toBe("Bob")
//         expect(res.body[res.body.length - 1].last_name).toBe("The Builder")
//         expect(res.body[res.body.length - 1].user_name).toBe("bbuilder")
//         expect(res.body[res.body.length - 1].password).toBe("yeshecan")
//         expect(res.body[res.body.length - 1].crew_id).toBe(2)
//         expect(res.body[res.body.length - 1].role).toBe('Operator')
//         expect(res.body[res.body.length - 1].experience_type).toBe('green')
//     })
// })

// // -------------------------------------------------------  Course Registration  -------------------------------------------------------
// describe('PATCH testing of /course_registration route', () => {
//     it('incorrect body should receive 400 error status', async () => {
//         const patch_body = {
//             field1: 'this is an incorrect post'
//         }

//         const res = await request(app).patch('/course_registration').send(patch_body)
//         expect(res.status).toBe(400)
//     })

//     const patch_body = {
//         course_id: 1,
//         user_id: 3,
//         in_progress: 'in_progress',
//         cert_earned: true
//     }
//     it('correct body should receive a 201 status', async () => {
//         const res = await request(app).patch('/course_registration').send(patch_body)
//         expect(res.status).toBe(201)
//     })

//     it('returns id of created course registration', async () => {
//         const res = await request(app).patch('/course_registration').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//     })

//     it('created course registration is visible in subsequent GET request', async () => {
//         let res = await request(app).patch('/course_registration').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//         res = await request(app).get('/course_registration')
//         expect(res.body[res.body.length - 1].course_id).toBe(1)
//         expect(res.body[res.body.length - 1].user_id).toBe(3)
//         expect(res.body[res.body.length - 1].in_progress).toBe("in_progress")
//         expect(res.body[res.body.length - 1].cert_earned).toBe(true)
//     })
// })

// // -------------------------------------------------------  Courses  -------------------------------------------------------
// describe('PATCH testing of /courses route', () => {
//     it('incorrect body should receive 400 error status', async () => {
//         const patch_body = {
//             field1: 'this is an incorrect post'
//         }

//         const res = await request(app).patch('/courses').send(patch_body)
//         expect(res.status).toBe(400)
//     })

//     const patch_body = {
//         course_name: "Test Course",
//         date_start: '08-29-2025',
//         date_end: '09-29-2025',
//         cert_granted: 'Test Cert'
//     }
//     it('correct body should receive a 201 status', async () => {
//         const res = await request(app).patch('/courses').send(patch_body)
//         expect(res.status).toBe(201)
//     })

//     it('returns id of created course', async () => {
//         const res = await request(app).patch('/courses').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//     })

//     it('created course is visible in subsequent GET request', async () => {
//         let res = await request(app).patch('/courses').send(patch_body)
//         expect(res.status).toBe(201)
//         expect(typeof res.body[0].id).toBe('number')
//         res = await request(app).get('/courses')
//         expect(res.body[res.body.length - 1].course_name).toBe("Test Course")
//         expect(res.body[res.body.length - 1].date_start).toBe("08-29-2025")
//         expect(res.body[res.body.length - 1].date_end).toBe("09-29-2025")
//         expect(res.body[res.body.length - 1].cert_granted).toBe("Test Cert")
//     })
// })