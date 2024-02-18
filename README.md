#Group Chat Application
This project is a Group Chat application built with Node.js, Express.js, Sequelize ORM, and Socket.IO. It provides features for users to sign up, log in, create groups, send messages within groups, and manage group participants. Messages are delivered in real-time using WebSocket communication.

##Table of Contents
Features
Prerequisites
Installation
Usage
Code Structure

##Features
User authentication and authorization (sign up, log in)
Creation and management of groups
Real-time messaging within groups using WebSocket (Socket.IO)
CRUD operations for messages and groups
Adding and removing participants from groups
Middleware for authentication and authorization

##Prerequisites
To run this application locally, you need to have the following installed:
Node.js
npm (Node Package Manager)
MySQL or any other compatible database management system

##Installation
###Clone this repository to your local machine:
git clone https://github.com/clementrozario/Group-Chat.git

###Navigate to the project directory:
cd Group-Chat

###Install dependencies:
npm install

###Set up your database:
Create a MySQL database for the application.
Configure the database connection by creating a .env file in the root directory of the project.
In the .env file, add the following variables with your database credentials:

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

###Run the database migrations to create the necessary tables:
npx sequelize-cli db:migrate

###Start the server:
npm start

##Code Structure
controllers/: Directory containing controller files for user, group, admin, and chat functionalities.
middleware/: Directory containing authentication middleware.
models/: Directory containing Sequelize models for database tables.
routes/: Directory containing Express routes for handling API requests.
services/: Directory containing services such as S3services for file uploads.
utils/: Directory containing utility functions and database configuration.
views/: Directory containing HTML and CSS files for the frontend.
index.js: Entry point of the application.
