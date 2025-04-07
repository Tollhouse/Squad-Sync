const request = require('supertest')
const app = require('../server.js')

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
})