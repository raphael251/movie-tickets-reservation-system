# Movie Tickets Reservation System

## Project Overview

This side project is a backend system to make movie tickets reservation. The idea is to have movies available for reservation by users.

This project was based on [one of the roadmap.sh backend path projects](https://roadmap.sh/projects/movie-reservation-system) but my idea is to go further and implement my own ideas from the initial one.

## Project Stage

The project is currently in the early stages of development. The main features are planned, but the implementation is still in progress.

## Features (Customer-Focused)

| Feature                           | Description                                                                                               | Status      |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------- |
| User account creation (sign up)   | N/A                                                                                                       | COMPLETE    |
| User account login                | N/A                                                                                                       | COMPLETE    |
| Movie management with a showtime. | Admins can manage movie showtimes, only being able to create a unique movie for a specific room and time. | COMPLETE    |
| Movie reservation                 | N/A                                                                                                       | IN-PROGRESS |

## Technical Roadmap

- [x] User sign up API
- [x] User login API
- [x] Movie creation API
- [x] Movie listing API
- [x] Authorization middleware
- [ ] Reservation endpoints
- [ ] Room CRUD endpoints

## Improvements

As the project evolves, there are several improvements to be made to enhance the system quality. Here are some of the planned improvements:

| Feature                        | Description                                                            | Status |
| ------------------------------ | ---------------------------------------------------------------------- | ------ |
| Logger                         | Implement Logging tool (e.g.: winstonjs) for a better logging system.  | TODO   |
| Dependency Injection Container | Implement a DI container (e.g.: inversifyjs) to manage dependencies.   | TODO   |
| Response standardization       | Standardize API responses for consistency.                             | TODO   |
| Input validation               | Implement input validation for all endpoints to ensure data integrity. | TODO   |
| Add factory functions          | Implement factory functions for creating entities.                     | TODO   |

## Core Technologies

- Node.js & Typescript
- TypeORM
- Express
- PostgreSQL

## Error Handling

Standard on handling errors in the application:

The use cases should throw an InvalidInputError when the input is invalid, and the HTTP controllers should catch this error and return a 400 Bad Request response with the error message.

The HTTP controllers should also catch other errors and return a 500 Internal Server Error response with a generic error message.

The HTTP controllers should not return the error stack trace to the client, as it may contain sensitive information. Instead, they should log the error stack trace for debugging purposes.

The HTTP controlers should catch any unexpected errors and return a 500 Internal Server Error response with a generic error message.

The HTTP controlllers should use instanceof to check the type of the error and return the appropriate response.

For the business logic errors, such as EmailAlreadyRegisteredError in the users sign up use case, the HTTP controllers should catch these errors and return a 409 Conflict response with the error message.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/raphael251/movie-tickets-reservation-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd movie-tickets-reservation-system
   ```
3. Install the dependencies:
   ```bash
    npm install
   ```
4. Set up the environment variables by creating a `.env` file based on the `.env.example` file.
5. Spin up the database using Docker:
   ```bash
   docker-compose up -d
   ```
   Ensure you have Docker installed and running on your machine.
6. Build the project:
   ```bash
   npm run build
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```
