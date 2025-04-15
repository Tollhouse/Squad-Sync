const request = require('supertest')
const { app } = require('../server.js')
jest.setTimeout(20000);  // 20 seconds timeout


const { compare } = require('bcryptjs')

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
describe('POST testing of /crew_rotations route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/crew_rotations').send(post_body)
        expect(res.status).toBe(400)
    })
    const post_body = {
        crew_id: 1,
        date_start: "11-29-2018",
        date_end: "11-29-2019",
        shift_type: "swing",
        shift_duration: 8,
        experience_type: 'yellow'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).post('/crew_rotations').send(post_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created crew rotation', async () => {
        const res = await request(app).post('/crew_rotations').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created crew rotation is visible in subsequent GET request', async () => {
        let res = await request(app).post('/crew_rotations').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/crew_rotations')
        expect(res.body[res.body.length - 1].crew_id).toBe(1)
        expect(res.body[res.body.length - 1].date_start).toBe("2018-11-29")
        expect(res.body[res.body.length - 1].date_end).toBe("2019-11-29")
        expect(res.body[res.body.length - 1].shift_type).toBe("swing")
        expect(res.body[res.body.length - 1].shift_duration).toBe(8)
        expect(res.body[res.body.length - 1].experience_type).toBe("yellow")
    })
})

// -------------------------------------------------------  CREWS  -------------------------------------------------------
describe('POST testing of /crews route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/crews').send(post_body)
        expect(res.status).toBe(400)
        expect(res.body.message).toBe('Submitted information is in the invalid format.')
    })

    const post_body = {
        crew_name: 'Test Crew'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).post('/crews').send(post_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created crew', async () => {
        const res = await request(app).post('/crews').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created crew is visible in subsequent GET request', async () => {
        let res = await request(app).post('/crews').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/crews')
        expect(res.body[res.body.length - 1].crew_name).toBe("Test Crew")
    })
})

// -------------------------------------------------------  USERS  -------------------------------------------------------
describe('POST testing of /users route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/users').send(post_body)
        expect(res.status).toBe(400)
    })

    const post_body = {
        first_name: 'Bob',
        last_name: 'The Builder',
        user_name: 'bbuilder',
        password: 'yeshecan',
        crew_id: 2,
        role: 'Operator',
        experience_type: 'green',
        privilege: 'scheduler',
        flight: "DOT"
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).post('/users').send(post_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created user', async () => {
        const res = await request(app).post('/users').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body.id).toBe('number')
    })

    it('created user is visible in subsequent GET request', async () => {
        let res = await request(app).post('/users').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body.id).toBe('number')
        res = await request(app).get('/users')
        expect(res.body[res.body.length - 1].first_name).toBe("Bob")
        expect(res.body[res.body.length - 1].last_name).toBe("The Builder")
        expect(res.body[res.body.length - 1].user_name).toBe("bbuilder")
        expect(res.body[res.body.length - 1].crew_id).toBe(2)
        expect(res.body[res.body.length - 1].role).toBe('Operator')
        expect(res.body[res.body.length - 1].experience_type).toBe('green')
        expect(res.body[res.body.length - 1].privilege).toBe('user')
        expect(res.body[res.body.length - 1].flight).toBe('DOO')
    })
})

describe('POST testing of /users/login route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/users/login').send(post_body)
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Please provide a non-empty username and password.')
    })

    it('login with non-existent user should return 404 status with message', async () => {
        const post_body = {
            user_name: 'AAAAAAAA',
            password: 'totallynormalpassword'
        }
        const res = await request(app).post('/users/login').send(post_body)
        expect(res.status).toBe(404)
        expect(res.body.error).toBe('User not found.')
    })

    it('login with existing user but wrong password should return 401 status with message', async () => {
        const post_body = {
            user_name: 'Curtis',
            password: 'totallynormalpassword'
        }
        const res = await request(app).post('/users/login').send(post_body)
        expect(res.status).toBe(401)
        expect(res.body.error).toBe('Password is incorrect.')
    })

    it('login with existing user and correct password should return 200 status with message', async () => {
        const post_body = {
            user_name: 'Curtis',
            password: 'Curtis'
        }
        const res = await request(app).post('/users/login').send(post_body)
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Login successful')
        expect(res.body.user.id).toBe(37)
        expect(res.body.user.privilege).toBe('commander')
    })
})

// -------------------------------------------------------  Course Registration  -------------------------------------------------------
describe('POST testing of /course_registration route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/course_registration').send(post_body)
        expect(res.status).toBe(400)
    })

    const post_body = {
        course_id: 1,
        user_id: 3,
        in_progress: 'in_progress',
        cert_earned: true
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).post('/course_registration').send(post_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created course registration', async () => {
        const res = await request(app).post('/course_registration').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created course registration is visible in subsequent GET request', async () => {
        let res = await request(app).post('/course_registration').send(post_body)
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
describe('POST testing of /courses route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/courses').send(post_body)
        expect(res.status).toBe(400)
    })

    const post_body = {
        course_name: "Test Course",
        date_start: '08-29-2025',
        date_end: '09-29-2025',
        cert_granted: 'Test Cert'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).post('/courses').send(post_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created course', async () => {
        const res = await request(app).post('/courses').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created course is visible in subsequent GET request', async () => {
        let res = await request(app).post('/courses').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/courses')
        expect(res.body[res.body.length - 1].course_name).toBe("Test Course")
        expect(res.body[res.body.length - 1].date_start).toBe("2025-08-29")
        expect(res.body[res.body.length - 1].date_end).toBe("2025-09-29")
        expect(res.body[res.body.length - 1].cert_granted).toBe("Test Cert")
    })
})