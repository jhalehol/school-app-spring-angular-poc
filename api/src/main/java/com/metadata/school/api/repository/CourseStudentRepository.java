package com.metadata.school.api.repository;

import com.metadata.school.api.entity.Course;
import com.metadata.school.api.entity.CourseStudent;
import com.metadata.school.api.entity.Student;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseStudentRepository extends CrudRepository<CourseStudent, Long> {

    long countByCourse(Course course);

    CourseStudent findDistinctFirstByCourseAndStudent(Course course, Student student);

    List<CourseStudent> getAllByCourse(Course course);

    List<CourseStudent> getAllByStudent(Student student);

    boolean existsByStudent(Student student);
}
