# EcoPantry Backend (Spring Boot + MongoDB)

## Overview
A ready-to-run Spring Boot backend for managing pantry ingredients and sending expiry reminders.

- Local MongoDB configured at `mongodb://localhost:27017/ecopantry`
- CRUD API for Ingredients (`/api/ingredients`)
- Scheduled expiry checks that log reminders and attempt email notifications (if SMTP configured)
- CORS enabled for frontend integration

## How to run
1. Install Java 17+ and Maven.
2. Start local MongoDB (default port 27017).
3. Build and run:
   ```
   mvn clean package
   mvn spring-boot:run
   ```
4. API will be available at `http://localhost:8080`.

## Notes
- To enable email notifications, fill `spring.mail.*` properties in `src/main/resources/application.yml`.
- The scheduled checker runs at a rate configured by `ecopantry.expiry.check-rate-ms` (milliseconds).
