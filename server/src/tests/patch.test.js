const request = require('supertest')
const { app } = require('../server.js')
jest.setTimeout(20000);  // 10 seconds timeout

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
        shift_type: "Night",
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
        expect(res.body[0].date_start).toBe("2018-11-29")
        expect(res.body[0].date_end).toBe("2019-11-29")
        expect(res.body[0].shift_type).toBe("Night")
        expect(res.body[0].shift_duration).toBe(12)
        expect(res.body[0].experience_type).toBe("red")
    })

    it('patched crew rotation is visible in subsequent GET request', async () => {
        let res = await request(app).patch('/crew_rotations/2').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/crew_rotations')
        expect(res.body[0].crew_id).toBe(1)
        expect(res.body[0].date_start).toBe("2018-11-29")
        expect(res.body[0].date_end).toBe("2019-11-29")
        expect(res.body[0].shift_type).toBe("Night")
        expect(res.body[0].shift_duration).toBe(12)
        expect(res.body[0].experience_type).toBe("red")
    })
})

// -------------------------------------------------------  CREWS  -------------------------------------------------------
describe('PATCH testing of /crews route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).patch('/crews/bad_request')
        expect(res.status).toBe(400)
    })

    it('incorrect patch body should receive 400 error status', async () => {
        const patch_body = {
            field1: 'this is an incorrect patch body'
        }

        const res = await request(app).patch('/crews/1').send(patch_body)
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Submitted information is in the invalid format.')
    })

    const patch_body = {
        crew_name: 'Test Crew'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).patch('/crews/1').send(patch_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created crew', async () => {
        const res = await request(app).patch('/crews/1').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created crew is visible in subsequent GET request', async () => {
        let res = await request(app).patch('/crews/1').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/crews')
        expect(res.body[res.body.length - 1].crew_name).toBe("Test Crew")
    })
})

// -------------------------------------------------------  USERS  -------------------------------------------------------
// TODO needs to test patches to user based on privilege/login
describe('PATCH testing of /users route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).patch('/users/bad_request')
        expect(res.status).toBe(400)
    })

    it('incorrect patch body should receive 400 error status', async () => {
        const patch_body = {
            field1: 'this is an incorrect patch body'
        }

        const res = await request(app).patch('/users/1').send(patch_body)
        expect(res.status).toBe(400)
    })

    const patch_body = {
        first_name: 'Bob',
        last_name: 'The Builder',
        user_name: 'bbuilder',
        password: 'yeshecan',
        crew_id: 2,
        role: 'Operator',
        experience_type: 'green',
        privilege: 'commander',
        flight: 'DOU'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).patch('/users/5').send(patch_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created user', async () => {
        const res = await request(app).patch('/users/6').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created crew is visible in subsequent GET request', async () => {
        let res = await request(app).patch('/users/7').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/users')
        expect(res.body[res.body.length - 1].first_name).toBe("Bob")
        expect(res.body[res.body.length - 1].last_name).toBe("The Builder")
        expect(res.body[res.body.length - 1].user_name).toBe("bbuilder")
        expect(res.body[res.body.length - 1].crew_id).toBe(2)
        expect(res.body[res.body.length - 1].role).toBe('Operator')
        expect(res.body[res.body.length - 1].experience_type).toBe('green')
        expect(res.body[res.body.length - 1].privilege).toBe('commander')
        expect(res.body[res.body.length - 1].flight).toBe('DOU')
    })
})

// -------------------------------------------------------  Course Registration  -------------------------------------------------------
describe('PATCH testing of /course_registration route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).patch('/course_registration/bad_request')
        expect(res.status).toBe(400)
    })

    it('incorrect patch body should receive 400 error status', async () => {
        const patch_body = {
            field1: 'this is an incorrect patch body'
        }

        const res = await request(app).patch('/course_registration/1').send(patch_body)
        expect(res.status).toBe(400)
    })

    const patch_body = {
        course_id: 1,
        user_id: 3,
        in_progress: 'in_progress',
        cert_earned: true
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).patch('/course_registration/4').send(patch_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created course registration', async () => {
        const res = await request(app).patch('/course_registration/5').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created course registration is visible in subsequent GET request', async () => {
        let res = await request(app).patch('/course_registration/6').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/course_registration')
        expect(res.body[res.body.length - 1].course_id).toBe(1)
        expect(res.body[res.body.length - 1].user_id).toBe(3)
        expect(res.body[res.body.length - 1].in_progress).toBe("in_progress")
        expect(res.body[res.body.length - 1].cert_earned).toBe(true)
    })
})

// -------------------------------------------------------  Courses  -------------------------------------------------------
describe('PATCH testing of /courses route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).patch('/courses/bad_request')
        expect(res.status).toBe(400)
    })

    it('incorrect patch body should receive 400 error status', async () => {
        const patch_body = {
            field1: 'this is an incorrect patch body'
        }

        const res = await request(app).patch('/courses/1').send(patch_body)
        expect(res.status).toBe(400)
    })

    const patch_body = {
        course_name: "Test Course",
        date_start: '08-29-2025',
        date_end: '09-29-2025',
        cert_granted: 'Test Cert'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).patch('/courses/1').send(patch_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created course', async () => {
        const res = await request(app).patch('/courses/1').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created course is visible in subsequent GET request', async () => {
        let res = await request(app).patch('/courses/1').send(patch_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/courses')
        expect(res.body[res.body.length - 1].course_name).toBe("Test Course")
        expect(res.body[res.body.length - 1].date_start).toBe("2025-08-29")
        expect(res.body[res.body.length - 1].date_end).toBe("2025-09-29")
        expect(res.body[res.body.length - 1].cert_granted).toBe("Test Cert")
    })
})