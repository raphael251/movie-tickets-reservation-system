# Movie Tickets Reservation System

## Project Overview

This side project is a backend system to make movie tickets reservation. The idea is to have movies available for reservation by users.

This project was based on [one of the roadmap.sh backend path projects](https://roadmap.sh/projects/movie-reservation-system) but my idea is to go further and implement my own ideas from the initial one.

## Project Stage

The project is currently in the early stages of development. The main features are planned, but the implementation is still in progress.

## Features (User-Focused)

| Feature                               | Description                                                                                                                 | Status   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| User sign up and login                | Users can create their own account and log in to it                                                                         | COMPLETE |
| Movie management                      | Admins can manage movie information, including creating, updating, and deleting movies.                                     | COMPLETE |
| Screening management with a showtime. | Admins can manage screening showtimes, only being able to create a unique screening for a specific theater and time window. | COMPLETE |
| Screening seat reservation            | Users can reserve a seat for specific screening                                                                             | COMPLETE |
| Reservation management                | Users can manage their current reservations and cancel them if needed                                                       | COMPLETE |

## Technical Roadmap

- [x] User sign up API
- [x] User login API
- [x] Movie creation API
- [x] Movie listing API
- [x] Authorization middleware
- [x] Reservation endpoints
- [x] Create Theater entity
- [x] Create Seat entity
- [x] Create Seed script to run on app startup to create the available theaters and seats (create CRUD for them in the future)
- [x] Rename Movie entity to Screening for a better naming and separation of concerns
- [x] Create ScreeningSeat entity for managing seat reservations within a screening
- [x] Populate the screening seats for a screening on creation
- [x] Create endpoint to list all seats in a screening
- [x] Update the reservations endpoint to reserve a screening seat instead of the old params
- [x] Create filter for the screening seats endpoint to filter screening seats by status
- [x] Create endpoint to list all user's reservations
- [x] Create a new Movie entity just for the static information about movies available for screening
- [x] Handle invalid ids on creation gracefully (on screenings endpoints and others as well)
- [x] Add cursor pagination on movies listing
- [x] Add rule for reservation cancellation: only allowed before 48 hours of the screening start time
- [x] Add initial end-to-end tests setup
- [x] Add pagination to screening seats listing endpoint
- [x] Add pagination to screenings listing endpoint
- [x] Add pagination to reservations listing endpoint
- [x] Add error handling on screening seats listing controller
- [x] Return reservation data on its creation
- [x] Review the reservation status
- [x] Refactor reservation and screening seat entities (as they are closely related) to use a simpler instance creation and handling approach, using the typeorm entity directly instead of two separated classes.
- [x] Refactor the Movie entity to have the same format as Reservation and Screening Seat that have already been refactored to use only one class.
- [x] Refactor the Screening entity to have the same format as Reservation and Screening Seat that have already been refactored to use only one class.
- [x] Refactor the Seat entity to have the same format as Reservation and Screening Seat, although it doesn't have a separated entity class, the name need to be changed, as well as the removal of the BaseEntity extension.
- [x] Refactor the Theater entity to have the same format as Reservation and Screening Seat, although it doesn't have a separated entity class, the name need to be changed, as well as the removal of the BaseEntity extension.
- [ ] Refactor the User entity to have the same format as Reservation and Screening Seat that have already been refactored to use only one class.
- [ ] Implement the returning of dto objects instead of entities to decouple the types and make the returning object more friendly to the clients.
  - [ ] CreateMovieController
  - [ ] ListMoviesController
  - [ ] UpdateMovieController
  - [ ] CreateScreeningController
  - [ ] ListScreeningSeatsController
  - [ ] ListScreeningsController
  - [ ] UsersLoginController
- [ ] Add the screening information on the reservation dto, for a better experience to the clients. When we get the reservations, we already want to see the screening info.
- [ ] Add lazy relation loading on the screening seat Entity to return the screening data as needed using typeorm

## Improvements

As the project evolves, there are several improvements to be made to enhance the system quality. Here are some of the planned improvements:

- [ ] [Logger] Implement Logging tool (e.g.: winstonjs) for a better logging system.
- [ ] [Dependency Injection Container] Implement a DI container (e.g.: inversifyjs) to manage dependencies.
- [ ] [Response standardization] Standardize API responses for consistency.
- [ ] [Input validation] Implement input validation for all endpoints to ensure data integrity.
- [ ] [Add factory functions] Implement factory functions for creating entities.
- [ ] [Seeder detailed verification] Currently the seeder just continues if it encounters any duplicate keys. It should handle the cases where the seed file was modified after the initial run.

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
