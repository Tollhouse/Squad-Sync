# Squad Sync 🚀

Squad Sync is designed as a single source of truth for managing unit scheduling requirements such as training courses, crew shift scheduling, and more. This application enables schedulers to quickly identify and resolve scheduling conflicts while ensuring that mission-critical requirements are met.

---

## 📚 Purpose of the Application

The purpose of this application is to centralize scheduling requirements for units. By integrating training courses, crew rotations, and other scheduling needs into a single platform, Squad Sync helps ensure smooth scheduling operations and minimizes conflicts.

---

## ✨ Features

- 🔐 **Role-Based Authentication:** Users are authenticated based on their roles and privileges.
- 🎓 **Training Management:** Manage training courses required for crew certifications and readiness.
- 🔄 **Crew Rotation:** Schedule and manage crew rotations based on training requirements and mission needs.
- ⚠️ **Conflict Detection:** Quickly identify scheduling conflicts for crew members.
- ➕ **Resource Submission:** Easily submit new users, training courses, and crew rotations.
- 🔄 **Certification Updates:** Update user certifications and availability according to mission requirements.
- 💻 **Interactive UI:** A responsive user interface built with React and Material-UI (MUI).
- 🛠️ **Robust Backend:** Powered by Express and Knex, ensuring efficient data management.

---

## 🏃 Run Locally

1. Clone the repository:

```bash
  git clone https://github.com/Tollhouse/Squad-Sync
```

2. Navigate to the project directory:

```bash
  cd Squad-Sync
```

3. Install dependencies

```bash
  npm install
```

4. Start the server

```bash
  npm run start
```

## ✅ Prerequisites

Before running the application, ensure that you have the following installed:

- Docker and Docker Compose installed on your machine.
- Node.js installed (if running locally without Docker).
- The following npm packages:
  - `create-vite@latest`
  - `react-router-dom`
  - `express`
  - `knex`
  - `pg`
  - `cors`
  - `bcrypt`
  - `cookie-parser`
  - `nodemon`

---

## 🗄️ Database and API Server instructions

To run this app on your own machine you will need to create your own database using your preferred software. This app was developed with a PostgreSQL database running in a docker container. The app can be spun up two different ways as shown below. The \*`docker compose up` requires docker to spin up each portion of the app (Client browser app, API, and database) in their own docker containers. This will require the fewest steps to run the app as is, but may make it a bit difficult to see live updates to the code. Node.js will require that you have a node environment installed. This will require some additional steps, but will give you more control over each portion of the app.

## 🐳 Docker Compose

### Verify Docker Installation

- **Check Docker Version:**
  ```bash
  docker -v
  ```
- If Docker is not installed, please install Docker Desktop or your preferred Docker engine.

- **Pull the PostgreSQL Image:**
  Skip if you already have the PostgreSQL image

  ```bash
  docker pull postgres
  ```

- Start all containers (Client, server and datbase) with Docker Compose:

  ```bash
  docker-compose up --build
  ```

---

## 💻 Running with Node.js

1. Set up the Environment
   To run the app using a node environment you will need to create a file called `.env` in the server folder. In this folder you will create a variable called `DB_CONNECTION_STRING` that will contain the environment variable of your database. An example of our variable is:

```bash
DB_CONNECTION_STRING=postgresql://[username]:[password]@[url]:[port]/[database name]
```

2. Install Dependencies:

```bash
  npm install
```

3. Run Migrations and seed the database:

```bash
  npx knex migrate:latest
```

This will create all of the table in your database and if you want some sample data you can run:

```bash
  npx knex seed:run
```

4. Start the server:

```bash
  npm run dev
```

---

## 🔌 API Endpoints

#### GET

```http
  GET /api/
```

| Parameter               | Description                                                                                 |
| :---------------------- | :------------------------------------------------------------------------------------------ |
| `/crew_rotations`       | returns an array of all crew rotations in the “crew_rotations” table                        |
| `/crews`                | returns an array of all crews in the “crews” table                                          |
| `/users`                | returns an array of all users in the "users" table                                          |
| `/course_registrations` | returns an array of all all course registration entries in the “course_registrations” table |
| `/courses`              | returns an array of all all courses listed in the "courses" table                           |

#### POST

```http
  POST /api/
```

| Parameter               | Description                                                                                                                                             |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/crew_rotations`       | creates a new crew rotation - returns id of created rotation                                                                                            |
| `/crews`                | adds a new crew to the “crews” table - should return id of created crew                                                                                 |
| `/signup`               | add new user to “users” table - should return id of created user                                                                                        |
| `/course_registrations` | adds a new record of a course that a user has been registered to the “course_registrations” table - should return the id of created course registration |
| `/courses`              | add new course to the list - should return the id of created course                                                                                     |

#### PATCH

```http
  PATCH /api/
```

| Parameter                   | Description                                                                |
| :-------------------------- | :------------------------------------------------------------------------- |
| `/crew_rotations/:id`       | cupdate an existing crew rotation(e.g., shift time, reassigned crew) by id |
| `/crews/:id`                | Update crew info by its id **(primary key)**                               |
| `/users:/id`                | Update user info by their id **(primary key)**                             |
| `/course_registrations/:id` | update info for a given registration                                       |
| `/courses/:id`              | Update info for a given course                                             |

#### DELETE

```http
  DELETE /api/
```

| Parameter                   | Description                                                                     |
| :-------------------------- | :------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `/crew_rotations/:id`       | `array`                                                                         | cdeletes a scheduled rotation(used when a shift is canceled or duplicated) |
| `/crews/:id`                | deletes a crew by its id                                                        |
| `/users:/id`                | removes user from system                                                        |
| `/course_registrations/:id` | removes a user’s registration from a course(if they drop out or are reassigned) |
| `/courses/:id`              | delete course from the list                                                     |

---

## 🧪 TESTING

- To run tests of the API endpoints from our back-end server:
  1. Ensure the database and server are running. You can use the docker-compose command from the installation instructions.
  2. Access the Server container:
  ```bash
    docker exec -it server_cont /bin/bash
  ```
  3. Run the test suite:
  ```bash
    npm test
  ```
  4. Checkout the coverage of these tests by running:
  ```bash
    npm run coverage
  ```
- To run tests of or React Client:
  1. Ensure the database, server, and client are all running. You can use the docker-compose command from the installation instructions.
  2. Navigate to the /client directory. From the root directory you can run:
  ```bash
    cd client
  ```
  3. To run the test suite, you can run either of the following two commands:
  ```bash
    npm run test
  ```
  ```bash
    npm run test:ui
  ```
  4. Checkout the coverage of these tests by running:
  ```bash
    npm run coverage:open
  ```

#### Test Troubleshooting
1. Ensure that both client and server tests are not running at the same time as this can cause test timeout and async issues on the client side tests due to tests often reseeding the database.

---

## 🔗 Roadmap

- [Figma Project Board](https://www.figma.com/board/U4zadFU39gYksswWp5EmW7/Supra-Coder-Capstone?node-id=0-1&p=f&t=nAqGW8a3c7aBlyi4-0)

- [Trello Kanban](https://trello.com/b/NbjM5WPK/squad-sync)

## 📝 DEV NOTES

- Ensure you have a .env file in the server directory with your connection string
- Running the database as a container only:

  1. Start the database with the following command:

  ```bash
      docker run -d \
      --name capstone_db \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=*insert_password_here* \
      -e POSTGRES_DB=capstone \
      -p 5432:5432 \
      postgres
  ```

  2. Start the server with the following commands:

  ```bash
    cd server
    npm start
  ```

- Running the database and server as containers (uses docker compose)

  1. Add the following to the .env file:

  ```bash
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=*insert_same_pass_from_above*
    POSTGRES_DB=capstone
  ```

  2. Start the database with the following command from the projects root directory

  ```bash
    docker-compose up --build
  ```

---

## 📸 Screenshots

<!-- ![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here) -->

---

## 🤝 Contributing

Feel free to fork this repository and create pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## 🧑‍💻 Authors

- [Curtis Bonham](https://www.github.com/curtisbonham)
- [Tyson Butler-Currier](https://github.com/Tollhouse)
- [Harman Gidda](https://www.github.com/harman1gidda)
- [Essence Jackson](https://www.github.com/EssEss03)
- [Lorena Longoria](https://www.github.com/lorenalongoria)
- [Michael Thomas](https://www.github.com/m-h-thomas)
- [Erik Voss](https://www.github.com/Chaos66-dev)
- [Landon Spencer](https://github.com/Landon-Spencer)
- [Jackie Luu](https://github.com/dytzi)

---

## 📄 License

This project is licensed under the MIT License.
