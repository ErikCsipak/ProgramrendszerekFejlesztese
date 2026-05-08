-- V3__Create_sequences.sql
-- Create missing sequences used by Hibernate and ensure their next values are set
-- to avoid conflicts with existing table data.

-- Course sequence
CREATE SEQUENCE IF NOT EXISTS course_SEQ START WITH 1 INCREMENT BY 50;
SELECT setval('course_SEQ', COALESCE((SELECT MAX(id) FROM course), 0) + 1, false);

-- Course schedule sequence
CREATE SEQUENCE IF NOT EXISTS course_schedule_SEQ START WITH 1 INCREMENT BY 50;
SELECT setval('course_schedule_SEQ', COALESCE((SELECT MAX(id) FROM course_schedule), 0) + 1, false);

-- Course enrollment sequence
CREATE SEQUENCE IF NOT EXISTS course_enrollment_SEQ START WITH 1 INCREMENT BY 50;
SELECT setval('course_enrollment_SEQ', COALESCE((SELECT MAX(id) FROM course_enrollment), 0) + 1, false);

-- User sequence (table name is quoted in earlier migrations)
CREATE SEQUENCE IF NOT EXISTS user_SEQ START WITH 1 INCREMENT BY 50;
SELECT setval('user_SEQ', COALESCE((SELECT MAX(id) FROM "user"), 0) + 1, false);

