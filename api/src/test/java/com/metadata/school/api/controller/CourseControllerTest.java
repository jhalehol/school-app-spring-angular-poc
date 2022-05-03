package com.metadata.school.api.controller;

import com.metadata.school.api.dto.CourseDto;
import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.CoursesPageDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.exception.ForbiddenException;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.service.CourseService;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ErrorCollector;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CourseControllerTest {

    private static final Long COURSE_ID = 777L;
    private static final Long STUDENT_ID = 999L;
    private static final int SELECTED_PAGE = 1;
    private static final int PAGE_SIZE = 10;

    @Rule
    public ErrorCollector errorCollector = new ErrorCollector();

    @Mock
    private CourseService courseService;

    @InjectMocks
    private CourseController controller;

    @Test
    public void givenCourseIdWhenGetCourseThenReturnOk() throws Exception {
        // Arrange
        final CourseDto courseDto = mock(CourseDto.class);
        when(courseService.getCourse(COURSE_ID)).thenReturn(courseDto);

        // Act
        final ResponseEntity<?> response = controller.getCourse(COURSE_ID);

        // Assert
        verify(courseService).getCourse(COURSE_ID);
        errorCollector.checkThat(response.getBody(), equalTo(courseDto));
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenCourseIdWhenGetCourseFailThenReturnFail() throws Exception {
        // Arrange
        when(courseService.getCourse(COURSE_ID)).thenThrow(NotFoundException.class);

        // Act
        final ResponseEntity<?> response = controller.getCourse(COURSE_ID);

        // Assert
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.NOT_FOUND));
    }

    @Test
    public void givenCourseDtoWhenAddThenReturnOk() throws Exception {
        // Arrange
        final CourseDto courseDto = mock(CourseDto.class);

        // Act
        final ResponseEntity<?> response = controller.addCourse(courseDto);

        // Assert
        verify(courseService).addCourse(courseDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenCourseDtoWhenAddFailsThenReturnFailed() throws Exception {
        // Arrange
        final CourseDto courseDto = mock(CourseDto.class);
        doThrow(InvalidParametersException.class).when(courseService).addCourse(courseDto);

        // Act
        final ResponseEntity<?> response = controller.addCourse(courseDto);

        // Assert
        verify(courseService).addCourse(courseDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void givenCourseDtoWhenUpdateThenReturnOk() throws Exception {
        // Arrange
        final CourseDto courseDto = mock(CourseDto.class);

        // Act
        final ResponseEntity<?> response = controller.updateCourse(COURSE_ID, courseDto);

        // Assert
        verify(courseService).updateCourse(COURSE_ID, courseDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenCourseDtoWhenUpdateFailsThenReturnFailed() throws Exception {
        // Arrange
        final CourseDto courseDto = mock(CourseDto.class);
        doThrow(InvalidParametersException.class).when(courseService)
                .updateCourse(COURSE_ID, courseDto);

        // Act
        final ResponseEntity<?> response = controller.updateCourse(COURSE_ID, courseDto);

        // Assert
        verify(courseService).updateCourse(COURSE_ID, courseDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void givenCourseIdWhenDeleteThenReturnOk() throws Exception {
        // Act
        final ResponseEntity<?> response = controller.deleteCourse(COURSE_ID);

        // Assert
        verify(courseService).deleteCourse(COURSE_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenCourseIdWhenDeleteFailsThenReturnFailed() throws Exception {
        // Arrange
        doThrow(InvalidParametersException.class).when(courseService)
                .deleteCourse(COURSE_ID);

        // Act
        final ResponseEntity<?> response = controller.deleteCourse(COURSE_ID);

        // Assert
        verify(courseService).deleteCourse(COURSE_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void givenPaginationWhenGetCoursesThenReturnOk() {
        // Arrange
        final CoursesPageDto pageDto = new CoursesPageDto();
        when(courseService.getCourses(any(PaginationDto.class))).thenReturn(pageDto);

        // Act
        final ResponseEntity<?> response = controller.getCourses(SELECTED_PAGE, PAGE_SIZE);

        // Assert
        verify(courseService).getCourses(any(PaginationDto.class));
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(pageDto));
    }

    @Test
    public void givenPaginationWhenGetAllCoursesWithoutStudentsThenReturnOk() {
        // Arrange
        final CoursesPageDto pageDto = new CoursesPageDto();
        when(courseService.getAllCoursesWithoutStudents(any(PaginationDto.class))).thenReturn(pageDto);

        // Act
        final ResponseEntity<?> response = controller.getCoursesWithoutStudents(SELECTED_PAGE, PAGE_SIZE);

        // Assert
        verify(courseService).getAllCoursesWithoutStudents(any(PaginationDto.class));
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(pageDto));
    }

    @Test
    public void givenCourseIdWhenGetCourseStudentsThenReturnOk() throws Exception {
        // Arrange
        final List<CourseStudentDto> courseStudents = Collections.emptyList();
        when(courseService.getCourseStudents(COURSE_ID)).thenReturn(courseStudents);

        // Act
        final ResponseEntity<?> response = controller.getCourseStudents(COURSE_ID);

        // Assert
        verify(courseService).getCourseStudents(COURSE_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(courseStudents));
    }

    @Test
    public void givenCourseIdWhenGetCourseStudentsFailsThenReturnFailed() throws Exception {
        // Arrange
        when(courseService.getCourseStudents(COURSE_ID)).thenThrow(NotFoundException.class);

        // Act
        final ResponseEntity<?> response = controller.getCourseStudents(COURSE_ID);

        // Assert
        verify(courseService).getCourseStudents(COURSE_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.NOT_FOUND));
    }

    @Test
    public void givenCourseIdAndStudentIdWhenRegisterThenReturnOk() throws Exception {
        // Act
        controller.registerStudentInCourse(COURSE_ID, STUDENT_ID);

        // Assert
        verify(courseService).registerStudentInCourse(COURSE_ID, STUDENT_ID);
    }

    @Test
    public void givenCourseIdAndStudentIdWhenRegisterFailsThenReturnFailed() throws Exception {
        // Arrange
        doThrow(ForbiddenException.class).when(courseService).registerStudentInCourse(COURSE_ID, STUDENT_ID);
        // Act
        controller.registerStudentInCourse(COURSE_ID, STUDENT_ID);

        // Assert
        verify(courseService).registerStudentInCourse(COURSE_ID, STUDENT_ID);
    }
}
