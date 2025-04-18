const request = require('supertest')
const { app } = require('../server.js')
const { isValidObject, checkEnums } = require('./test_utils.js')

let config = require('../../knexfile.js')['development'];
let knex = require('knex')(config);

beforeAll(async () => {
  knex = require('knex')(config);
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
});

afterAll(async () => {
  await knex.destroy();
});

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
        response.body.forEach(crew_rotation => {
            const valid = isValidObject(crew_rotation, col_names, col_types);
            expect(valid).toBe(true);
          });
    });

    it('all values of the fields "shift_type" and "experience_type" should be one of the values defined in the ERD', async () => {
        const shift_values = ['Day', 'Swing', 'Night']
        const experience_values = ['Red', 'Yellow', 'Green']
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

describe('GET /crew_rotations/:id' , () => {
  it('should return a 400 error when bad id is supplied' , async () => {
    const res = await request(app).get('/crew_rotations/bad_request')
    expect(res.status).toBe(400)
  })

  it('should return a 200 status when correct id is supplied' , async () => {
    const res = await request(app).get('/crew_rotations/1')
    expect(res.status).toBe(200)
  })

  it('should return a 200 status and a message if id was not found in the table', async () => {
    const res = await request(app).get('/crew_rotations/100000')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('No matching crew rotation found for id: 100000.')
  })

  it('should return an array of one object when correct id is supplied' , async () => {
    const res = await request(app).get('/crew_rotations/1')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(typeof res.body[0]).toBe('object')
    expect(res.body.length < 2).toBe(true) // can be zero if there were no matching rows
  })

  // works with 'simplifiedCrewRotation' in seed data
  it('returned object should be equal to crew with id: 1', async () => {
    const res = await request(app).get('/crew_rotations/1')
    expect(res.status).toBe(200)
    expect(res.body[0].id).toBe(1)
    expect(res.body[0].crew_id).toBe(1)
    expect(res.body[0].shift_type).toBe('Day')
    expect(res.body[0].shift_duration).toBe(8)
    expect(res.body[0].experience_type).toBe('Green')
  })
})

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

describe('GET /crews/:id' , () => {
    it('should return a 400 error when bad id is supplied' , async () => {
      const res = await request(app).get('/crews/bad_request')
      expect(res.status).toBe(400)
    })

    it('should return a 200 status when correct id is supplied' , async () => {
      const res = await request(app).get('/crews/1')
      expect(res.status).toBe(200)
    })

    it('should return a 200 status and a message if id was not found in the table', async () => {
      const res = await request(app).get('/crews/100000')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('No matching crew found with id 100000.')
    })

    it('should return an array of one object when correct id is supplied' , async () => {
      const res = await request(app).get('/crews/1')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(typeof res.body[0]).toBe('object')
      expect(res.body.length < 2).toBe(true) // can be zero if there were no matching rows
    })

    it('returned object should be equal to crew with id: 1', async () => {
      const res = await request(app).get('/crews/1')
      expect(res.status).toBe(200)
      expect(res.body[0].id).toBe(1)
      expect(res.body[0].crew_name).toBe("Alpha")
    })
})

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
        const col_names = ['id', 'user_name', 'first_name', 'last_name', 'password', 'crew_id', 'role', 'experience_type', 'privilege', 'flight']
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true)
        expect(col_names.every(col => Object.hasOwn(response.body[0], col))).toBe(true)
    });

    it('all returned element properties should match the type definition in the ERD', async () => {
        const col_names = ['id', 'user_name', 'first_name', 'last_name', 'password', 'crew_id', 'role', 'experience_type', 'privilege', 'flight']
        const col_types = ['number', 'string', 'string', 'string', 'string', 'number', 'string', 'string', 'string', 'string']
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
        const experience_values = ['Red', 'Yellow', 'Green']
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

describe('GET /users/:id', () => {
  it('should return a 400 status with bad request', async () => {
    const response = await request(app).get('/users/bad_request');
    expect(response.status).toBe(400);
  });

  it('should return a 404 status with message of no user found for non existent id', async () => {
    const response = await request(app).get('/users/10000');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found.')
  });

  it('should return a 200 status when called with correct id', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
  });

  it('should return one object', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object')
  });

  it('returned element should match user with id 38', async () => {
      const response = await request(app).get('/users/38');
      expect(response.status).toBe(200);
      expect(response.body.last_name).toBe('Tory')
      expect(response.body.user_name).toBe('Tory')
      expect(response.body.role).toBe('Training Manager')
      expect(response.body.crew_id).toBe(7)
      expect(response.body.experience_type).toBe('Green')
      expect(response.body.privilege).toBe('training_manager')
  });
})

describe('GET /users/schedule', () => {
  it('should return a 200 status ', async () => {
    const response = await request(app).get('/users/schedule');
    expect(response.status).toBe(200);
  });

  it('should return an array ', async () => {
    const response = await request(app).get('/users/schedule');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true)
  });

  it('there should be 2 properties per object in the array, one for user_id, one for dates', async () => {
      const response = await request(app).get('/users/schedule');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body[0]).toHaveProperty('user_id');
      expect(response.body[0]).toHaveProperty('dates');
  });
})

describe('GET /users/schedule/:id', () => {
  it('should return a 200 status ', async () => {
    const response = await request(app).get('/users/schedule/1');
    expect(response.status).toBe(200);
  });

  it('should return an array ', async () => {
    const response = await request(app).get('/users/schedule/1');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true)
  });

  it('array should have 2 elements, one for crewDates, one for courseDates', async () => {
    const response = await request(app).get('/users/schedule/1');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2)
    expect(Array.isArray(response.body[0].crewDates)).toBe(true)
    expect(Array.isArray(response.body[1].courseDates)).toBe(true)
  });
})

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

describe('GET /course_registration/:id' , () => {
  it('should return a 400 error when bad id is supplied' , async () => {
    const res = await request(app).get('/course_registration/bad_request')
    expect(res.status).toBe(400)
  })

  it('should return a 200 status when correct id is supplied' , async () => {
    const res = await request(app).get('/course_registration/1')
    expect(res.status).toBe(200)
  })

  it('should return a 200 status and a message if id was not found in the table', async () => {
    const res = await request(app).get('/course_registration/100000')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('should return an array of one object when correct id is supplied' , async () => {
    const res = await request(app).get('/course_registration/1')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(typeof res.body[0]).toBe('object')
    expect(res.body.length < 2).toBe(true) // can be zero if there were no matching rows
  })
})

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

describe('GET /courses/:id' , () => {
  it('should return a 400 error when bad id is supplied' , async () => {
    const res = await request(app).get('/courses/bad_request')
    expect(res.status).toBe(400)
  })

  it('should return a 200 status when correct id is supplied' , async () => {
    const res = await request(app).get('/courses/1')
    expect(res.status).toBe(200)
  })

  it('should return a 200 status and a message if id was not found in the table', async () => {
    const res = await request(app).get('/courses/100000')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('No matching course found for id: 100000.')
  })

  it('should return an array of one object when correct id is supplied' , async () => {
    const res = await request(app).get('/courses/1')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(typeof res.body[0]).toBe('object')
    expect(res.body.length < 2).toBe(true) // can be zero if there were no matching rows
  })

  // works with simplifiedCourses in seed data
  it('returned object should be equal to crew with id: 1', async () => {
    const res = await request(app).get('/courses/1')
    expect(res.status).toBe(200)
    expect(res.body[0].id).toBe(1)
    expect(res.body[0].course_name).toBe('Crew Commander')
    expect(res.body[0].seats).toBe(10)
    expect(res.body[0].description).toBe('Training teaches how to supervise and how to oversee all crew requirements.')
    expect(res.body[0].date_start).toBe('2024-03-01')
    expect(res.body[0].date_end).toBe('2024-03-31')
    expect(res.body[0].cert_granted).toBe('Crew Commander')
  })
})

describe('GET /courses/roster/:id' , () => {
  it('should return a 400 error when bad id is supplied' , async () => {
    const res = await request(app).get('/courses/roster/bad_request')
    expect(res.status).toBe(400)
  })

  it('should return a 200 status when correct id is supplied' , async () => {
    const res = await request(app).get('/courses/roster/1')
    expect(res.status).toBe(200)
  })

  it('should return a 200 status and a message if id was not found in the table', async () => {
    const res = await request(app).get('/courses/roster/100000')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Either course roster is empty for course id: 100000, or course id: 100000 does not exist')
  })

  it('should return an array of objects when correct id is supplied' , async () => {
    const res = await request(app).get('/courses/roster/2')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(typeof res.body[0]).toBe('object')
  })

  it('all returned objects should be have course id: 2', async () => {
    const res = await request(app).get('/courses/roster/2')
    expect(res.status).toBe(200)
    expect(res.body.every((course) => course.course_id == 2)).toBe(true)
  })
})