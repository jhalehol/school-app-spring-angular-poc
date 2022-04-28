CREATE TABLE sch_users (
                           user_id SERIAL,
                           username varchar(50),
                           password varchar(100),
                           name varchar(100),
                           surname varchar(100),
                           role varchar(50) NOT NULL
)
;

CREATE TABLE sch_courses (
                            course_id SERIAL,
                            course_name varchar(50) NOT NULL,
                            teacher_name varchar(200) NULL,
                            credits bigint DEFAULT 0
)
;

CREATE TABLE sch_students (
                             student_id SERIAL,
                             id_number varchar(50) NOT NULL,
                             name varchar(100) NOT NULL,
                             surname varchar(100),
                             birth_date bigint,
                             address varchar(200)
)
;

CREATE TABLE sch_course_students (
                                     id_student_course SERIAL,
                                     course_id bigint NOT NULL,
                                     student_id bigint NOT NULL
)
;

ALTER TABLE sch_users
    ADD CONSTRAINT UQ_sch_users_username UNIQUE (username)
;

ALTER TABLE sch_users ADD CONSTRAINT PK_sch_users
    PRIMARY KEY (user_id)
;

ALTER TABLE sch_courses ADD CONSTRAINT PK_sch_courses
    PRIMARY KEY (course_id)
;

ALTER TABLE sch_students ADD CONSTRAINT PK_sch_students
    PRIMARY KEY (student_id)
;

ALTER TABLE sch_course_students ADD CONSTRAINT PK_sch_course_students
    PRIMARY KEY (id_student_course)
;

ALTER TABLE sch_course_students
    ADD CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES sch_courses (course_id),
    ADD CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES sch_students (student_id)
;
