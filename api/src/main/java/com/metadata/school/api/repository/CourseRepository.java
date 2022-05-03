package com.metadata.school.api.repository;

import com.metadata.school.api.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends PagingAndSortingRepository<Course, Long> {

    Page<Course> findAllByOrderById(Pageable pageable);

    @Query(nativeQuery = true, value = "SELECT * FROM sch_courses c " +
            "WHERE c.course_id NOT IN (SELECT DISTINCT sc.course_id FROM sch_course_students sc) " +
            "ORDER BY c.course_id")
    Page<Course> findAllWithoutStudents(Pageable pageable);
}
