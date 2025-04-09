const request = require('supertest')
const { app } = require('../server.js')
const { isValidObject, checkEnums } = require('./test_utils.js')

// TODO check foreign keys?

// -------------------------------------------------------  CREW ROTATIONS  -------------------------------------------------------
describe('GET /crew_rotations', () => {
    it('should return a 200 status ', async () => {
      const response = await request(app).get('/crew_rotations');
      expect(response.status).toBe(200);
    });

    it('should return an array ', async () => {
      const response = await request(app).get('/crew_rotations');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
    });

    it('an individual element of the array should be a "crew_rotations" element', async () => {
        const col_names = ['id', 'crew_id', 'date_start', 'date_end', 'shift_type', 'shift_duration', 'experience_type']
        const response = await request(app).get('/crew_rotations');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['id', 'crew_id', 'date_start', 'date_end', 'shift_type', 'shift_duration', 'experience_type']
        const col_types = ['number', 'number', 'string', 'string', 'string', 'number', 'string']
        const response = await request(app).get('/crew_rotations');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        // console.log(response.body[0])
        response.body.forEach(crew_rotation => {
            const valid = isValidObject(crew_rotation, col_names, col_types);
            expect(valid).toBe(true);
          });
    });

    it('all values of the fields "shift_type" and "experience_type" should be one of the values defined in the ERD', async () => {
        const shift_values = ['day', 'swing', 'mid', 'rest', 'night']
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

// -------------------------------------------------------   CREWS   -------------------------------------------------------
describe('GET /crews', () => {
    it('should return a 200 status ', async () => {
      const response = await request(app).get('/crews');
      expect(response.status).toBe(200);
    });

    it('should return an array ', async () => {
      const response = await request(app).get('/crews');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
    });

    it('an individual element of the array should be a "crew" element', async () => {
        const col_names = ['id', 'crew_name']
        const response = await request(app).get('/crews');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['id', 'crew_name']
        const col_types = ['number', 'string']
        const response = await request(app).get('/crews');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(crew => {
            const valid = isValidObject(crew, col_names, col_types);
            expect(valid).toBe(true);
          });
    });
});

  // -------------------------------------------------------   USERS   -------------------------------------------------------
describe('GET /users', () => {
    it('should return a 200 status ', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
    });

    it('should return an array ', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
    });

    it('an individual element of the array should be a "user" element', async () => {
        const col_names = ['id', 'user_name', 'first_name', 'last_name', 'password', 'crew_id', 'role', 'experience_type']
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['id', 'user_name', 'first_name', 'last_name', 'password', 'crew_id', 'role', 'experience_type']
        const col_types = ['number', 'string', 'string', 'string', 'string', 'number', 'string', 'string']
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(user => {
            const valid = isValidObject(user, col_names, col_types);
            expect(valid).toBe(true);
          });
    });

    it('all values of the field "experience_type" should be one of the values defined in the ERD', async () => {
        const experience_values = ['red', 'yellow', 'green']
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(user => {
            const valid = checkEnums(user, 'experience_type', experience_values);
            expect(valid).toBe(true);
          });
    });
});

// -------------------------------------------------------   Course Registrations   -------------------------------------------------------
describe('GET /course_registration', () => {
    it('should return a 200 status ', async () => {
      const response = await request(app).get('/course_registration');
      expect(response.status).toBe(200);
    });

    it('should return an array ', async () => {
      const response = await request(app).get('/course_registration');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
    });

    it('an individual element of the array should be a "course_registration" element', async () => {
        const col_names = ['id', 'user_id', 'course_id', 'in_progress', 'cert_earned']
        const response = await request(app).get('/course_registration');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['id', 'user_id', 'course_id', 'in_progress', 'cert_earned']
        const col_types = ['number', 'number', 'number', 'string', 'boolean']
        const response = await request(app).get('/course_registration');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(course_reg => {
            const valid = isValidObject(course_reg, col_names, col_types);
            expect(valid).toBe(true);
          });
    });

    it('all values of the field "in_progress" should be one of the values defined in the ERD', async () => {
        const in_progress_values = ['scheduled', 'in_progress', 'completed']
        const response = await request(app).get('/course_registration');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(course_reg => {
            const valid = checkEnums(course_reg, 'in_progress', in_progress_values);
            expect(valid).toBe(true);
          });
    });
});

// -------------------------------------------------------   Courses   -------------------------------------------------------
describe('GET /courses', () => {
    it('should return a 200 status ', async () => {
      const response = await request(app).get('/courses');
      expect(response.status).toBe(200);
    });

    it('should return an array ', async () => {
      const response = await request(app).get('/courses');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
    });

    it('an individual element of the array should be a "course" element', async () => {
        const col_names = ['id', 'course_name', 'date_start', 'date_end', 'cert_granted']
        const response = await request(app).get('/courses');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['id', 'course_name', 'date_start', 'date_end', 'cert_granted']
        const col_types = ['number', 'string', 'string', 'string', 'string']
        const response = await request(app).get('/courses');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        // this is checking to see if all the objects in the returned body have the right keys and that the value of each key is the right type
        response.body.forEach(course => {
            const valid = isValidObject(course, col_names, col_types);
            expect(valid).toBe(true);
          });
    });
});
