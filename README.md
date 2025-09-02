# Secure REST API for User and Course Management

This project is a **secure RESTful API** built with **Node.js, Express, and MongoDB**.  
It provides endpoints for managing users, authentication, and course-related data, with HTTPS support for secure communication.

## Features

-  **User Authentication**
  - Secure login and registration with JWT
  - Password hashing with bcrypt

-  **User Management**
  - Public and private user routes
  - Administrator role with elevated privileges
  - Automatic creation of a default admin account

-  **Course Management**
  - Manage degree courses
  - Handle course applications
  - Support for additional training modules (e.g., "Abnahme")

-  **Security**
  - HTTPS server with SSL certificates
  - Input validation
  - Error handling for missing or broken routes

## Tech Stack

- **Backend:** Node.js, Express  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT, bcrypt  
- **Other Tools:** Nodemon, Body-Parser, Config  

## Project Structure
