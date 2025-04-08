const request = require('supertest')
const { app } = require('../server.js')
jest.setTimeout(10000);  // 10 seconds timeout

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
describe('DELETE testing of /crew_rotations/:id route', () => {
    it('incorrect id should receive 400 error status', async () => {

        const res = await request(app).delete('/crew_rotations/bad_route')
        expect(res.status).toBe(400)
    })

    it('correct url/id should receive a 201 status', async () => {
        const res = await request(app).delete('/crew_rotations/1')
        expect(res.status).toBe(201)
    })

    it('returns successful message for deleted resource', async () => {
        const res = await request(app).delete('/crew_rotations/1')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Crew Rotation successfully deleted.')
    })

    it('deleted crew rotation is not visible in subsequent GET request', async () => {
        let res = await request(app).delete('/crew_rotations/1')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Crew Rotation successfully deleted.')
        res = await request(app).get('/crew_rotations')
        expect(res.body.every((crew_rotation) => crew_rotation.id != 1)).toBe(true)
    })
})

// -------------------------------------------------------  CREWS  -------------------------------------------------------
describe('DELETE testing of /crews route', () => {
    it('incorrect id should receive 400 error status', async () => {

        const res = await request(app).delete('/crews/bad_route')
        expect(res.status).toBe(400)
    })

    it('correct url/id should receive a 201 status', async () => {
        const res = await request(app).delete('/crews/2')
        expect(res.status).toBe(201)
    })

    it('returns successful message of deleted crew', async () => {
        const res = await request(app).delete('/crews/3')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Crew successfully deleted.')
    })

    it('deleted crew is not visible in subsequent GET request', async () => {
        let res = await request(app).delete('/crews/2')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Crew successfully deleted.')
        res = await request(app).get('/crews')
        expect(res.body.every((crew) => crew.id != 2)).toBe(true)
    })
})

// -------------------------------------------------------  USERS  -------------------------------------------------------
describe('DELETE testing of /users route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).delete('/users/bad_route')
        expect(res.status).toBe(400)
    })

    it('correct url/id should receive a 201 status', async () => {
        const res = await request(app).delete('/users/5')
        expect(res.status).toBe(201)
    })

    it('returns successful message of deleted user', async () => {
        const res = await request(app).delete('/users/6')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('User successfully deleted.')
    })

    it('deleted user is not visible in subsequent GET request', async () => {
        let res = await request(app).delete('/users/8')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('User successfully deleted.')
        res = await request(app).get('/users')
        expect(res.body.every((user) => user.id != 8)).toBe(true)
    })
})

// -------------------------------------------------------  Course Registration  -------------------------------------------------------
describe('DELETE testing of /course_registration route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).delete('/course_registration/bad_route')
        expect(res.status).toBe(400)
    })

    it('correct url/route should receive a 201 status', async () => {
        const res = await request(app).delete('/course_registration/12')
        expect(res.status).toBe(201)
    })

    it('returns successful deletion message', async () => {
        const res = await request(app).delete('/course_registration/13')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Course registration successfully deleted.')
    })

    it('created course registration is visible in subsequent GET request', async () => {
        let res = await request(app).delete('/course_registration/14')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Course registration successfully deleted.')
        res = await request(app).get('/course_registration')
        expect(res.body.every((course_reg) => course_reg.id != 14)).toBe(true)
    })
})

// -------------------------------------------------------  Courses  -------------------------------------------------------
describe('DELETE testing of /courses route', () => {
    it('incorrect url/id should receive 400 error status', async () => {

        const res = await request(app).delete('/courses/bad_request')
        expect(res.status).toBe(400)
    })

    it('correct url/id should receive a 201 status', async () => {
        const res = await request(app).delete('/courses/1')
        expect(res.status).toBe(201)
    })

    it('returns successful deletion message', async () => {
        const res = await request(app).delete('/courses/2')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Course successfully deleted.')
    })

    it('deleted course is not visible in subsequent GET request', async () => {
        let res = await request(app).delete('/courses/3')
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Course successfully deleted.')
        res = await request(app).get('/courses')
        expect(res.body.every((course) => course.id != 3)).toBe(true)
    })
})