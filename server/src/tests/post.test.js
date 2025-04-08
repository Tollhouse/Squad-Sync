const request = require('supertest')
const { app } = require('../server.js')

// let knex = require('knex')(require('../../knexfile.js')['development']);
let config = require('../../knexfile.js')['development'];
console.log(config);  // Check if the config object has 'client' and 'connection'
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

describe('POST testing of /crewRotations route', () => {
    it('incorrect body should receive 400 error status', async () => {
        const post_body = {
            field1: 'this is an incorrect post'
        }

        const res = await request(app).post('/crewRotations').send(post_body)
        expect(res.status).toBe(400)
    })


    const post_body = {
        crew_id: 1,
        date_start: "2018-11-29",
        date_end: "2019-11-29",
        shift_type: "swing",
        shift_duration: 8,
        experience_type: 'yellow'
    }
    it('correct body should receive a 201 status', async () => {
        const res = await request(app).post('/crewRotations').send(post_body)
        expect(res.status).toBe(201)
    })

    it('returns id of created crew rotation', async () => {
        const res = await request(app).post('/crewRotations').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
    })

    it('created crew rotation is visible in subsequent GET request', async () => {
        let res = await request(app).post('/crewRotations').send(post_body)
        expect(res.status).toBe(201)
        expect(typeof res.body[0].id).toBe('number')
        res = await request(app).get('/crewRotations')
        expect(res.body[res.body.length - 1].crew_id).toBe(1)
        expect(res.body[res.body.length - 1].date_start).toBe("2018-11-29")
        expect(res.body[res.body.length - 1].date_end).toBe("2019-11-29")
        expect(res.body[res.body.length - 1].shift_type).toBe("swing")
        expect(res.body[res.body.length - 1].shift_duration).toBe(8)
        expect(res.body[res.body.length - 1].experience_type).toBe("yellow")
    })
})