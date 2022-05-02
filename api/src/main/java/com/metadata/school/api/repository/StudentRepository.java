package com.metadata.school.api.repository;

import com.metadata.school.api.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends PagingAndSortingRepository<Student, Long> {

    Page<Student> findAllByOrderById(Pageable pageable);
}
