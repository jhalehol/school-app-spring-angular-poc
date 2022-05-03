package com.metadata.school.api.repository;

import com.metadata.school.api.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends PagingAndSortingRepository<Student, Long> {

    Page<Student> findAllByOrderById(Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT * FROM sch_students s " +
            "WHERE s.student_id NOT IN (SELECT DISTINCT sc.student_id FROM sch_course_students sc) " +
            "ORDER BY student_id")
    Page<Student> findAllWithoutCourses(Pageable pageable);
}
