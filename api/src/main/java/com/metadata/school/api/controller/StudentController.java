package com.metadata.school.api.controller;

import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.dto.StudentDto;
import com.metadata.school.api.dto.StudentsPageDto;
import com.metadata.school.api.exception.ForbiddenException;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.service.CourseService;
import com.metadata.school.api.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final CourseService courseService;

    public StudentController(StudentService studentService, CourseService courseService) {
        this.studentService = studentService;
        this.courseService = courseService;
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        try {
            final StudentDto studentDto = studentService.getStudent(id);
            return ResponseEntity.ok(studentDto);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<?> addStudent(@RequestBody StudentDto student) {
        try {
            final StudentDto studentDto = studentService.addStudent(student);
            return ResponseEntity.ok(studentDto);
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentDto student) {
        try {
            final StudentDto studentDto = studentService.updateStudent(id, student);
            return ResponseEntity.ok(studentDto);
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok().build();
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ForbiddenException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{selectedPage}/{pageSize}", produces = "application/json")
    public ResponseEntity<?> getStudents(@PathVariable Integer selectedPage, @PathVariable Integer pageSize) {
        final PaginationDto pagination = PaginationDto.builder()
                .pageNumber(selectedPage)
                .pageSize(pageSize)
                .build();
        final StudentsPageDto pageDto = studentService.getStudents(pagination);
        return ResponseEntity.ok(pageDto);
    }

    @GetMapping(value = "/{id}/courses", produces = "application/json")
    public ResponseEntity<?> getStudentCourses(@PathVariable Long id) {
        try {
            final List<CourseStudentDto> courseStudents = courseService.getStudentCourses(id);
            return ResponseEntity.ok().body(courseStudents);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
