React and Node.JS form, small test to send information from the React form to the back-end console with a dropdown menu with data pulled from a JSON.

# Instructions
Run docker-compose build, then docker-compose up -d in the root directory and docker-compose down to stop the container

# Modules
express-template\index.js - Sets up express and adds the api routes
    GET /api/supervisors - Pulls the JSON online, sorts it, and sends the supervisors formatted in an array
    POST /api/submit - Validates the input, and prints to the console if valid, sends error message to front-end if not
express packages - cors, express, request, sort-json-array
http://localhost:8080

react-template\src\App.js - Contains the notification forms which calls the GET and POSTs from Express
react-template\src\Header.js - Contains the header
react-template\package.json - Modified with a localhost proxy to the back-end
http://localhost:3000

# Docker instructions

```
docker-compose build
docker-compose up
```
You should now be able to access the running project through localhost at the port shown in the terminal. In the example below, http://localhost:3000.

```
❯ docker-compose up


If you need to shut down the project, run `docker-compose down`. 
