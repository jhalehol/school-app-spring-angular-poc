package com.metadata.school.api.controller;

import com.metadata.school.api.dto.CourseDto;
import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.CoursesPageDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.exception.ForbiddenException;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("api/courses")
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

    @PostMapping(value = "/add", produces = "application/json")
    public ResponseEntity<?> addCourse(@RequestBody CourseDto course) {
        try {
            courseService.addCourse(course);
            return ResponseEntity.ok().build();
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping(value = "/update/{id}", produces = "application/json")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody CourseDto course) {
        try {
            courseService.updateCourse(id, course);
            return ResponseEntity.ok().build();
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "/delete/{id}", produces = "application/json")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok().build();
        } catch (InvalidParametersException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<?> getCourses(@RequestBody PaginationDto pagination) {
        final CoursesPageDto pageDto = courseService.getCourses(pagination);
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

    @PostMapping(value = "/{courseId}/student/add/{studentId}", produces = "application/json")
    public ResponseEntity<?> registerStudentInCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            courseService.registerStudentInCourse(courseId, studentId);
            return ResponseEntity.ok().build();
        } catch (NotFoundException | ForbiddenException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
