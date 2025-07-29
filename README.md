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
| Movie management with a showtime. | Admins can manage movie showtimes, only being able to create a unique movie for a specific room and time. | IN-PROGRESS |
| Movie seats management.           | N/A                                                                                                       | TODO        |
| Movie reservation                 | N/A                                                                                                       | TODO        |

## Technical Roadmap

- [x] User sign up API
- [x] User login API
- [x] Movie creation API
- [ ] Movie listing API
- [ ] Reservation endpoints
- [ ] Authorization middleware
- [ ] Room CRUD endpoints

## Improvements

As the project evolves, there are several improvements to be made to enhance the system quality. Here are some of the planned improvements:

| Feature | Description                                                           | Status |
| ------- | --------------------------------------------------------------------- | ------ |
| Logger  | Implement Logging tool (e.g.: winstonjs) for a better logging system. | TODO   |

## Core Technologies

- Node.js & Typescript
- TypeORM
- Express
- PostgreSQL
