CREATE TABLE "user" (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE course (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id BIGINT NOT NULL REFERENCES "user"(id),
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PLAN' CHECK (status IN ('IN_PLAN', 'APPROVED', 'ARCHIVED')),
    max_students INT NOT NULL,
    current_enrollment INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by BIGINT REFERENCES "user"(id)
);

CREATE TABLE course_schedule (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255)
);

CREATE TABLE course_enrollment (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES course(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES "user"(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(2),
    UNIQUE(course_id, student_id)
);

CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_course_teacher_id ON course(teacher_id);
CREATE INDEX idx_course_status ON course(status);
CREATE INDEX idx_course_schedule_course_id ON course_schedule(course_id);
CREATE INDEX idx_course_enrollment_course_id ON course_enrollment(course_id);
CREATE INDEX idx_course_enrollment_student_id ON course_enrollment(student_id);
