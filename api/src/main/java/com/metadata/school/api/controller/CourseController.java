package com.metadata.school.api.controller;

import com.metadata.school.api.dto.CourseDto;
import com.metadata.school.api.dto.CourseRegistrationResultDto;
import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.CoursesPageDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.exception.ForbiddenException;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<?> getCourse(@PathVariable Long id) {
        try {
            final CourseDto courseDto = courseService.getCourse(id);
            return ResponseEntity.ok(courseDto);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(produces = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCourse(@RequestBody CourseDto course) {
        try {
            final CourseDto courseDto = courseService.addCourse(course);
            return ResponseEntity.ok(courseDto);
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseDto course) {
        try {
            final CourseDto courseDto = courseService.updateCourse(id, course);
            return ResponseEntity.ok(courseDto);
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/{id}", produces = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok().build();
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ForbiddenException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping(value = "/{selectedPage}/{pageSize}", produces = "application/json")
    public ResponseEntity<?> getCourses(@PathVariable Integer selectedPage, @PathVariable Integer pageSize) {
        final PaginationDto pagination = PaginationDto.builder()
                .pageNumber(selectedPage)
                .pageSize(pageSize)
                .build();
        final CoursesPageDto pageDto = courseService.getCourses(pagination);
        return ResponseEntity.ok(pageDto);
    }

    @GetMapping(value = "/available/{studentId}", produces = "application/json")
    public ResponseEntity<?> getStudentCoursesAvailable(@PathVariable Long studentId) {
        try {
            final List<CourseDto> courses = courseService.getAllAvailableForStudent(studentId);
            return ResponseEntity.ok(courses);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping(value = "/empty/{selectedPage}/{pageSize}", produces = "application/json")
    public ResponseEntity<?> getCoursesWithoutStudents(@PathVariable Integer selectedPage, @PathVariable Integer pageSize) {
        final PaginationDto pagination = PaginationDto.builder()
                .pageNumber(selectedPage)
                .pageSize(pageSize)
                .build();
        final CoursesPageDto pageDto = courseService.getAllCoursesWithoutStudents(pagination);
        return ResponseEntity.ok(pageDto);
    }

    @GetMapping(value = "/{id}/students", produces = "application/json")
    public ResponseEntity<?> getCourseStudents(@PathVariable Long id) {
        try {
            final List<CourseStudentDto> courseStudents = courseService.getCourseStudents(id);
            return ResponseEntity.ok().body(courseStudents);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(value = "/register/{studentId}", produces = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerStudentInCourse(@PathVariable Long studentId,
            @RequestBody List<Long> courses) {
        try {
            List<CourseRegistrationResultDto> results = courseService.registerStudentInCourses(studentId, courses);
            return ResponseEntity.ok(results);
        } catch (NotFoundException | ForbiddenException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
