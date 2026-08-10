# Aluminium Section Application

This is a monorepo containing a Next.js frontend and a Spring Boot backend, utilizing Supabase for database and authentication.

## Project Structure
- `/frontend`: Next.js 15 (React 19, TypeScript, Vanilla CSS) application.
- `/backend`: Spring Boot 4.1.0 multi-module Maven project.

## Requirements
- Node.js (v20+)
- Java 21
- Maven
- Supabase Project

## Backend Setup

1. Navigate to the `backend/` directory.
2. Edit `backend/application/src/main/resources/application-dev.yml` and provide your Supabase details:
   - Database URL (Session mode)
   - Database username/password
   - JWT Issuer URI (`https://<project-ref>.supabase.co/auth/v1`)
3. Run the application:
   ```bash
   mvn clean install
   cd application
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

## Frontend Setup

1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in `.env.local`.
4. Run the development server:
   ```bash
   npm run dev
   ```
