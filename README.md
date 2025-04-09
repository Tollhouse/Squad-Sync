
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


## Database and API Server instructions
To run this app on your own machine you will need to create your own database using your preferred software. This app was developed with a PostgreSQL database running in a docker container. The app can be spun up two different ways as shown below. The *`docker compose up` requires docker to spin up each portion of the app (Client browser app, API, and database) in their own docker containers. This will require the fewest steps to run the app as is, but may make it a bit difficult to see live updates to the code. Node.js will require that you have a node environment installed. This will require some additional steps, but will give you more control over each portion of the app.
### Docker Compose

### Node.js
To run the app using a node environment you will need to create a file called `.env` in the server folder. In this folder you will create a variable called `DB_CONNECTION_STRING` that will contain the environment variable of your database. An example of our variable is:

` DB_CONNECTION_STRING=postgresql://[username]:[password]@[url]:[port]/[database name]`

Once this variable is created you can run:

```bash
  npm install
```

To install all dependencies followed by:

```bash
  npx knex migrate:latest
```

This will create all of the table in your database and if you want some sample data you can run:

```bash
  npx knex seed:run
```

Everything should be ready now to start the API server by running:

```bash
  npm run dev
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


## TESTING

- To run tests of the API endpoints from our back-end server:
  - Ensure both containers are running. You can use the docker-compose command from the installation instructions.
  - Run the following command to navigate into the server container
  ```bash
    docker exec -it server_cont /bin/bash
  ```
  - Run the test command:
  ```bash
    npm test
  ```



## Roadmap

- [Figma Project Board](https://www.figma.com/board/U4zadFU39gYksswWp5EmW7/Supra-Coder-Capstone?node-id=0-1&p=f&t=nAqGW8a3c7aBlyi4-0)

## DEV NOTES
- Ensure you have a .env file in the server directory with your connection string
- Running the database as a container, but not the server:
    - Start the database with the following command:
    ```bash
        docker run -d \
        --name capstone_db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=*insert_password_here* \
        -e POSTGRES_DB=capstone \
        -p 5432:5432 \
        postgres
    ```
    - Start the server with the following commands:
    ```bash
        cd server
        npm start
    ```
- Running the database and server as containers (uses docker compose)
    - Add the following to the .env file:
    ```
      POSTGRES_USER=postgres
      POSTGRES_PASSWORD=*insert_same_pass_from_above*
      POSTGRES_DB=capstone
    ```
    - Start the database with the following command from the projects root directory
    ```bash
      docker-compose up --build
    ```





## Authors


- [Curtis Bonham](https://www.github.com/curtisbonham)
- [Tyson Butler-Currier](https://github.com/Tollhouse)
- [Harman Gidda](https://www.github.com/harman1gidda)
- [Essence Jackson](https://www.github.com/EssEss03)
- [Lorena Longoria](https://www.github.com/lorenalongoria)
- [Michael Thomas](https://www.github.com/m-h-thomas)
- [Erik Voss](https://www.github.com/Chaos66-dev)
- [Landon Spencer](https://github.com/Landon-Spencer)



