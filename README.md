
# Squad Sync

This app aims to provided a single source of truth for unit scheduling requirements (training courses, crew shift scheduling, etc.). This will make it easier for schedulers to see scheduling conflicts and adjust to meet mission requirements.


## Screenshots

<!-- ![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here) -->


## Run Locally

Clone the project

```bash
  git clone https://github.com/Tollhouse/Squad-Sync
```

Go to the project directory

```bash
  cd Squad-Sync
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## API Endpoints

#### GET

```http
  GET /api/
```

| Parameter |  Description                |
| :-------- |  :------------------------- |
| `/crew_rotations` | returns an array of all crew rotations in the “crew_rotations” table |
| `/crews` |  returns an array of all crews in the “crews” table|
| `/users` |  returns an array of all users in the "users" table|
| `/course_registrations` | returns an array of all all course registration entries in the “course_registrations” table|
| `/courses` |  returns an array of all all courses listed in the "courses" table|

#### POST

```http
  POST /api/
```

| Parameter |  Description                |
| :-------- | :------------------------- |
| `/crew_rotations` |  creates a new crew rotation - returns id of created rotation |
| `/crews` |  adds a new crew to the “crews” table - should return id of created crew |
| `/signup` |  add new user to “users” table - should return id of created user|
| `/course_registrations` | adds a new record of a course that a user has been registered to the “course_registrations” table - should return the id of created course registration|
| `/courses` |  add new course to the list - should return the id of created course|

#### PATCH

```http
  PATCH /api/
```

| Parameter |  Description                |
| :-------- | :------------------------- |
| `/crew_rotations/:id` | cupdate an existing crew rotation(e.g., shift time, reassigned crew) by id |
| `/crews/:id` | Update crew info by its id **(primary key)** |
| `/users:/id` |  Update user info by their id **(primary key)**|
| `/course_registrations/:id` | update info for a given registration|
| `/courses/:id` | Update info for a given course|

#### DELETE

```http
  DELETE /api/
```

| Parameter | Description                |
| :-------- |  :------------------------- |
| `/crew_rotations/:id` | `array` | cdeletes a scheduled rotation(used when a shift is canceled or duplicated)|
| `/crews/:id` | deletes a crew by its id|
| `/users:/id`  | removes user from system|
| `/course_registrations/:id`  | removes a user’s registration from a course(if they drop out or are reassigned)|
| `/courses/:id` | delete course from the list|



## Roadmap

- [Figma Project Board](https://www.figma.com/board/U4zadFU39gYksswWp5EmW7/Supra-Coder-Capstone?node-id=0-1&p=f&t=nAqGW8a3c7aBlyi4-0)




## Authors


- [Curtis Bonham](https://www.github.com/curtisbonham)
- [Tyson Butler-Currier](https://github.com/Tollhouse)
- [Harman Gidda](https://www.github.com/harman1gidda)
- [Essence Jackson](https://www.github.com/EssEss03)
- [Lorena Longoria](https://www.github.com/lorenalongoria)
- [Michael Thomas](https://www.github.com/m-h-thomas)
- [Erik Voss](https://www.github.com/Chaos66-dev)



