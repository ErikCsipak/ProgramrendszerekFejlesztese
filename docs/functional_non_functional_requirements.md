# Functional and Non-Functional Requirements

This document lists the functional requirements (FR) and non-functional requirements (NFR) for the CourseMgmt application.

---

## Functional Requirements (FR)

FR-01: Authentication
- Description: The system allows users to register, log in and log out using email/password. Authentication is based on JWT tokens.
- Actors: Students, Teachers, Admins
- Acceptance criteria:
  - POST /api/auth/register creates a new user and returns 201.
  - POST /api/auth/login returns a JWT and user info on success.
  - POST /api/auth/logout invalidates client session (server no-op for stateless JWT).

  *Note: only students can register. There is default registered admin user, who can add more admins or teachers.*

FR-02: Authorization & Roles
- Description: The system restricts actions according to user roles: STUDENT, TEACHER, ADMIN.
- Acceptance criteria:
  - Role-protected endpoints return 403 for unauthorized roles.
  - Teachers can create/update/delete only their own courses.
  - Admin can access admin-only endpoints (approve/reject courses, user management).

FR-03: Course Management
- Description: Teachers can create, edit, view, and delete courses. Courses have schedules. Admins can approve or reject courses.
- Endpoints: POST /api/courses, PUT /api/courses/{id}, GET /api/courses/{id}, DELETE /api/courses/{id}
- Acceptance criteria:
  - Creating a course returns 201 and course representation.
  - Editing a course updates only fields provided and does not implicitly create duplicate schedules unless schedules are explicitly provided.
  - Deleting a course returns 204.

FR-04: Course Listings
- Description: The system provides course lists: available courses and "my courses" for students, courses to approve or reject for admins, and teacher-owned courses for teachers.
- Endpoints: GET /api/courses/available, GET /api/courses/all, GET /api/courses/mine
- Acceptance criteria:
  - Available courses list excludes courses that are not open.
  - Teacher "mine" returns only courses associated with the teacher.

FR-05: Enrollment
- Description: Students can join or leave courses using dedicated endpoints.
- Endpoints: POST /api/enrollments/courses/{id}/join, DELETE /api/enrollments/courses/{id}/leave, GET /api/enrollments/my-courses
- Acceptance criteria:
  - Join returns 200 and increments currentEnrollment up to maxStudents.
  - When a course is full, join is rejected with a meaningful error.
  - Leave returns 204 and decrements currentEnrollment.

FR-06: Admin Review Workflow
- Description: Admins can list pending courses and approve or reject them.
- Endpoints: GET /api/admin/pending-courses, POST /api/admin/courses/{id}/approve, POST /api/admin/courses/{id}/reject
- Acceptance criteria:
  - Approve sets course status to APPROVED and records approvedAt/approvedBy.
  - Reject sets course to an appropriate rejected/archived state.

FR-07: User Management
- Description: Admins can list, view, create users.
- Endpoints: GET /api/admin/users, GET /api/admin/users/{id}, PUT /api/admin/users/{id}
- Acceptance criteria:
  - Admin operations return appropriate status codes and updated resources.

FR-08: Course Details UI Integration
- Description: The frontend renders course details inside the Student Dashboard so a user can view details while browsing lists.
- Acceptance criteria:
  - Clicking "View Details" on the student UI navigates to /student/courses/{id} and shows CourseDetail inside the dashboard.

FR-09: Responsive Navigation
- Description: Provide a top navigation that collapses to a hamburger menu on small screens and shows breadcrumbs and user badge on larger screens.
- Acceptance criteria:
  - Navbar hides or collapses on small viewports and expands on click.
---

## Non-Functional Requirements (NFR)

NFR-SEC-01: Transport Security
- Requirement: All API traffic must be served over HTTPS in production.
- Verification: Configuration/manifest shows TLS enabled; endpoints unreachable via HTTP (or redirect).

NFR-SEC-02: Authentication/Token Security
- Requirement: JWT tokens must be signed with secure keys (RS256 preferred) and validated server-side; tokens expire after a reasonable TTL with refresh options.
- Verification: Key pair present, token validation in place, token TTL documented.

NFR-SEC-03: Authorization
- Requirement: Role-based access controls is enforced server-side for all protected endpoints.
- Verification: Role-protected endpoints have annotations (e.g., @RolesAllowed) and tests exercise unauthorized access.

NFR-USR-01: Usability
- Requirement: UI is responsive and intuitive. Breadcrumbs, navigation and actions are be discoverable.
- Verification: Usability testing, responsiveness on desktop and mobile.

NFR-PRIV-01: Data Protection & Privacy (MUST)
- Requirement: Personal data (email, user info) is stored securely.

NFR-DEP-01: Deployment & Configuration (SHOULD)
- Requirement: The application is containerized (Docker) and deployable via docker-compose / Kubernetes with environment configuration separated from code.

---

