const request = require('supertest')
const { app } = require('../server.js')
const { isValidObject, checkEnums } = require('./test_utils.js')

describe('GET /crew_rotations', () => {
    it('should return an array ', async () => {
      const response = await request(app).get('/crew_rotations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
    });

    it('an individual element of the array should be a "crew_rotations" element', async () => {
        const col_names = ['pk_id', 'crew_id', 'date_start', 'date_end', 'shift_type', 'shift_duration', 'experience_type']
        const response = await request(app).get('/crew_rotations');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['pk_id', 'crew_id', 'date_start', 'date_end', 'shift_type', 'shift_duration', 'experience_type']
        const col_types = ['number', 'number', 'string', 'string', 'string', 'number', 'string']
        const response = await request(app).get('/crew_rotations');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(crew_rotation => {
            const valid = isValidObject(crew_rotation, col_names, col_types);
            expect(valid).toBe(true);
          });
    });

    it('all values of the fields "shift_type" and "experience_type" should be one of the values defined in the ERD', async () => {
        const shift_values = ['day', 'swing', 'mid']
        const experience_values = ['red', 'yellow', 'green']
        const response = await request(app).get('/crew_rotations');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(crew_rotation => {
            let valid = checkEnums(crew_rotation, 'shift_type', shift_values);
            expect(valid).toBe(true);
            valid = checkEnums(crew_rotation, 'experience_type', experience_values);
            expect(valid).toBe(true);
          });
    });
  });