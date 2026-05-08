-- V2__Create_default_users.sql
-- Inserts two default users (admin and teacher).

INSERT INTO "user" (id, username, email, password_hash, full_name, role, active)
    VALUES (1, 'admin@example.com', 'admin@example.com', '$argon2i$v=19$m=65536,t=2,p=1$t7TQWPFY9aIC2mlojwvDRA$D/kNDcBg8M8cuEq1aNT7s58rcYwFS+vKa6hT17qnjFo', 'Default Admin', 'ADMIN', TRUE);

INSERT INTO "user" (id, username, email, password_hash, full_name, role, active)
    VALUES (2, 'teacher@example.com', 'teacher@example.com', '$argon2i$v=19$m=65536,t=2,p=1$bjPqucbvzv+cCRxdJid1vw$l7FX76K4Yjx95UgfEHM/pR5WlJps7wnA11BfKcrlgns', 'Default Teacher', 'TEACHER', TRUE);

