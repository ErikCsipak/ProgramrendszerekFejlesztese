# Course Management System

A full-stack course management application for managing student enrollments, course approvals, and role-based access control.

## System Overview

This is a three-tier application consisting of:

- **Backend**: Quarkus REST API with Panache ORM and JWT authentication
- **Frontend**: Angular single-page application
- **Database**: PostgreSQL relational database

### Key Features

#### Admin Features
- View and manage all courses
- Approve/reject teacher-created courses (changing from IN_PLAN to APPROVED)
- Create and manage pre-registered users (teachers and admins)
- View all system users

#### Teacher Features
- Create new courses (start in IN_PLAN status)
- Edit own courses while in IN_PLAN status
- View students enrolled in approved courses
- Cannot approve courses themselves

#### Student Features
- Self-register to the system
- View available (APPROVED, non-full) courses
- Join available courses
- View list of enrolled courses
- Leave courses

## Prerequisites

- Docker and Docker Compose
- Git (for cloning the repository)

**OR for local development:**
- Java 21 (OpenJDK or similar)
- Maven 3.9+
- Node.js 20+ and npm
- PostgreSQL 15+

## Quick Start with Docker Compose

### 1. Clone the Repository
```bash
cd ProgramrendszerekFejlesztese
```

### 2. Build and Start Services
```bash
docker-compose up --build
```

This will:
- Create and start PostgreSQL database on port 5432
- Build and start Quarkus backend on port 8080
- Build and start Angular frontend on port 80 (served via Nginx)
- Run database migrations automatically

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432 (credential: coursemgmt/coursemgmt123)

## Local Development Setup

### Backend Setup

#### 1. Prerequisites
```bash
# Java 21
java -version

# Maven
mvn -version
```

#### 2. PostgreSQL Setup
```bash
# Run PostgreSQL locally (or use Docker)
docker run -d \
  --name coursemgmt-postgres \
  -e POSTGRES_DB=coursemgmt \
  -e POSTGRES_USER=coursemgmt \
  -e POSTGRES_PASSWORD=coursemgmt123 \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 3. Start Backend
```bash
cd backend
mvn clean quarkus:dev
```

The backend will start on http://localhost:8080 and automatically create tables via Flyway migrations.

### Frontend Setup

#### 1. Prerequisites
```bash
node --version  # v20+
npm --version   # 10+
```

#### 2. Install Dependencies
```bash
cd frontend
npm install
```

#### 3. Start Development Server
```bash
npm start
```

The frontend will be available at http://localhost:4200

(Note: The dev server proxies API calls to http://localhost:8080)

## API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "STUDENT",
    "active": true
  }
}
```

#### Register (Students only)
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "Jane Student"
}
```

#### Validate Token
```
GET /api/auth/validate
Authorization: Bearer {token}
```

### Course Endpoints

#### Get Available Courses (Students)
```
GET /api/courses/available
Authorization: Bearer {token}
```

#### Get All Courses (Admins)
```
GET /api/courses/all
Authorization: Bearer {token}
```

#### Get Teacher's Courses
```
GET /api/courses/mine
Authorization: Bearer {token}
```

#### Get Course Details
```
GET /api/courses/{id}
Authorization: Bearer {token}
```

#### Create Course (Teachers/Admins)
```
POST /api/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Introduction to Java",
  "description": "Learn Java programming",
  "maxStudents": 30,
  "schedules": [
    {
      "dayOfWeek": "Monday",
      "startTime": "09:00:00",
      "endTime": "10:30:00",
      "location": "Room 101"
    }
  ]
}
```

#### Update Course (Teacher, IN_PLAN only)
```
PUT /api/courses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Course Name",
  "description": "Updated description",
  "maxStudents": 35,
  "schedules": [...]
}
```

#### Delete Course
```
DELETE /api/courses/{id}
Authorization: Bearer {token}
```

### Enrollment Endpoints

#### Get Student's Courses
```
GET /api/enrollments/my-courses
Authorization: Bearer {token}
```

#### Join Course
```
POST /api/enrollments/courses/{courseId}/join
Authorization: Bearer {token}
```

#### Leave Course
```
DELETE /api/enrollments/courses/{courseId}/leave
Authorization: Bearer {token}
```

#### Get Enrolled Students
```
GET /api/enrollments/courses/{courseId}/students
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Pending Courses
```
GET /api/admin/pending-courses
Authorization: Bearer {token}
```

#### Approve Course
```
POST /api/admin/courses/{courseId}/approve
Authorization: Bearer {token}
```

#### Reject Course
```
POST /api/admin/courses/{courseId}/reject
Authorization: Bearer {token}
```

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer {token}
```

#### Create User (Admin only)
```
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password123",
  "fullName": "John Teacher",
  "role": "TEACHER"  // or "ADMIN"
}
```

## Database Schema

### User Table
- `id` (BIGSERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE NOT NULL)
- `password_hash` (VARCHAR NOT NULL)
- `full_name` (VARCHAR NOT NULL)
- `role` (VARCHAR CHECK in ADMIN, TEACHER, STUDENT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `active` (BOOLEAN DEFAULT TRUE)

### Course Table
- `id` (BIGSERIAL PRIMARY KEY)
- `name` (VARCHAR NOT NULL)
- `description` (TEXT)
- `teacher_id` (BIGINT FK to user)
- `status` (VARCHAR CHECK in IN_PLAN, APPROVED, ARCHIVED)
- `max_students` (INT NOT NULL)
- `current_enrollment` (INT DEFAULT 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `approved_at` (TIMESTAMP)
- `approved_by` (BIGINT FK to user)

### CourseSchedule Table
- `id` (BIGSERIAL PRIMARY KEY)
- `course_id` (BIGINT FK to course)
- `day_of_week` (VARCHAR NOT NULL)
- `start_time` (TIME NOT NULL)
- `end_time` (TIME NOT NULL)
- `location` (VARCHAR)

### CourseEnrollment Table
- `id` (BIGSERIAL PRIMARY KEY)
- `course_id` (BIGINT FK to course)
- `student_id` (BIGINT FK to user)
- `enrolled_at` (TIMESTAMP)
- `grade` (VARCHAR)
- `UNIQUE(course_id, student_id)`

## Testing the Application

### End-to-End Test Scenario

1. **Teacher Workflow**:
   - Login as teacher (or create via admin)
   - Create a course (starts as IN_PLAN)
   - View course in dashboard

2. **Admin Approval**:
   - Login as admin
   - Go to "Pending Courses"
   - Approve the teacher's course (changes to APPROVED)

3. **Student Workflow**:
   - Register as new student
   - Login
   - View available courses (sees approved courses only)
   - Join a course (if not full)
   - View "My Courses"
   - Leave course

4. **Verify Capacity**:
   - Multiple students join until course is full
   - Verify full courses don't appear in available list

## Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker-compose logs backend

# Verify database connection
psql -h localhost -U coursemgmt -d coursemgmt
```

### Frontend can't connect to API
- Verify backend is running: `curl http://localhost:8080/health`
- Check browser console for CORS errors
- Verify nginx.conf proxy settings

### Database migrations fail
- Check migration files in `backend/src/main/resources/db/migration/`
- Verify PostgreSQL is running
- Check database logs: `docker-compose logs postgres`

## Development Workflow

### Making Backend Changes
1. Edit Java files in `backend/src/main/java/`
2. Hot-reload happens automatically in `quarkus:dev` mode
3. Test API endpoints using Postman or curl

### Making Frontend Changes
1. Edit TypeScript/HTML in `frontend/src/app/`
2. Changes reload automatically with `npm start`
3. Check browser console for errors

### Database Changes
1. Create new Flyway migration in `backend/src/main/resources/db/migration/`
2. Follow naming: `V{number}__{description}.sql`
3. Restart backend to apply migration

## Deployment

### Docker Compose Deployment
The system is ready to deploy with:
```bash
docker-compose up --build
```

All services will start automatically with proper networking and health checks.

### Production Considerations
For production deployment:
1. Use environment-specific configurations
2. Store secrets in environment variables (not in code)
3. Configure HTTPS/SSL
4. Set up proper logging and monitoring
5. Use persistent volumes for database
6. Consider using Kubernetes or cloud PaaS

## Architecture Decisions

- **Quarkus**: High-performance Java framework with fast startup and low memory usage
- **Panache**: Simplified JPA ORM with Quarkus integration
- **JWT**: Stateless authentication suitable for REST APIs
- **Angular**: Modern frontend framework with strong typing (TypeScript)
- **PostgreSQL**: Reliable relational database
- **Docker Compose**: Local development and simple deployment

## Project Structure

```
ProgramrendszerekFejlesztese/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/example/coursemgmt/
│       │   ├── entity/          # JPA entities
│       │   ├── resource/        # REST endpoints
│       │   ├── service/         # Business logic
│       │   ├── exception/       # Custom exceptions
│       │   ├── dto/             # Data transfer objects
│       │   └── security/        # JWT & password handling
│       └── resources/
│           ├── application.properties
│           └── db/migration/    # Flyway migrations
│
├── frontend/
│   ├── package.json
│   ├── angular.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── app/
│       │   ├── auth/            # Login/Register
│       │   ├── courses/         # Course management
│       │   ├── admin/           # Admin dashboard
│       │   ├── student/         # Student dashboard
│       │   ├── teacher/         # Teacher dashboard
│       │   └── shared/          # Guards, interceptors, models
│       ├── styles.css
│       └── main.ts
│
├── docker-compose.yml
└── README.md
```

## Future Enhancements

- Course grading system
- Course reviews and ratings
- Email notifications
- Real-time notifications (WebSockets)
- Advanced scheduling (recurring patterns)
- Document uploads for courses
- Student progress tracking
- Attendance management
- Kubernetes deployment manifests
- CI/CD pipeline (GitHub Actions)
- Comprehensive test coverage

---

**Created**: 2024
**Stack**: Quarkus + Angular + PostgreSQL + Docker
