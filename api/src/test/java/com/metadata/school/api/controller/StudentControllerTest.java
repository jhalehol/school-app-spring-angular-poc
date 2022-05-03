package com.metadata.school.api.controller;

import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.dto.StudentDto;
import com.metadata.school.api.dto.StudentsPageDto;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.service.CourseService;
import com.metadata.school.api.service.StudentService;
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
public class StudentControllerTest {

    private static final Long STUDENT_ID = 777L;
    private static final int SELECTED_PAGE = 1;
    private static final int PAGE_SIZE = 10;

    @Rule
    public ErrorCollector errorCollector = new ErrorCollector();

    @Mock
    private StudentService studentService;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private StudentController controller;

    @Test
    public void givenStudentIdWhenGetStudentThenReturnOk() throws Exception {
        // Arrange
        final StudentDto studentDto = mock(StudentDto.class);
        when(studentService.getStudent(STUDENT_ID)).thenReturn(studentDto);

        // Act
        final ResponseEntity<?> response = controller.getStudent(STUDENT_ID);

        // Assert
        verify(studentService).getStudent(STUDENT_ID);
        errorCollector.checkThat(response.getBody(), equalTo(studentDto));
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenStudentIdWhenGetStudentFailThenReturnFail() throws Exception {
        // Arrange
        when(studentService.getStudent(STUDENT_ID)).thenThrow(NotFoundException.class);

        // Act
        final ResponseEntity<?> response = controller.getStudent(STUDENT_ID);

        // Assert
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.NOT_FOUND));
    }

    @Test
    public void givenStudentDtoWhenAddThenReturnOk() throws Exception {
        // Arrange
        final StudentDto studentDto = mock(StudentDto.class);
        final StudentDto studentSaved = mock(StudentDto.class);
        when(studentService.addStudent(studentDto)).thenReturn(studentSaved);

        // Act
        final ResponseEntity<?> response = controller.addStudent(studentDto);

        // Assert
        verify(studentService).addStudent(studentDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(studentSaved));
    }

    @Test
    public void givenStudentDtoWhenAddFailsThenReturnFailed() throws Exception {
        // Arrange
        final StudentDto studentDto = mock(StudentDto.class);
        doThrow(InvalidParametersException.class).when(studentService).addStudent(studentDto);

        // Act
        final ResponseEntity<?> response = controller.addStudent(studentDto);

        // Assert
        verify(studentService).addStudent(studentDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void givenStudentDtoWhenUpdateThenReturnOk() throws Exception {
        // Arrange
        final StudentDto studentDto = mock(StudentDto.class);

        // Act
        final ResponseEntity<?> response = controller.updateStudent(STUDENT_ID, studentDto);

        // Assert
        verify(studentService).updateStudent(STUDENT_ID, studentDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenStudentDtoWhenUpdateFailsThenReturnFailed() throws Exception {
        // Arrange
        final StudentDto studentDto = mock(StudentDto.class);
        doThrow(InvalidParametersException.class).when(studentService)
                .updateStudent(STUDENT_ID, studentDto);

        // Act
        final ResponseEntity<?> response = controller.updateStudent(STUDENT_ID, studentDto);

        // Assert
        verify(studentService).updateStudent(STUDENT_ID, studentDto);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void givenStudentIdWhenDeleteThenReturnOk() throws Exception {
        // Act
        final ResponseEntity<?> response = controller.deleteStudent(STUDENT_ID);

        // Assert
        verify(studentService).deleteStudent(STUDENT_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    }

    @Test
    public void givenStudentIdWhenDeleteFailsThenReturnFailed() throws Exception {
        // Arrange
        doThrow(InvalidParametersException.class).when(studentService)
                .deleteStudent(STUDENT_ID);

        // Act
        final ResponseEntity<?> response = controller.deleteStudent(STUDENT_ID);

        // Assert
        verify(studentService).deleteStudent(STUDENT_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    public void givenPaginationWhenGetStudentsThenReturnOk() {
        // Arrange
        final StudentsPageDto studentsPageDto = new StudentsPageDto();
        when(studentService.getStudents(any(PaginationDto.class))).thenReturn(studentsPageDto);

        // Act
        final ResponseEntity<?> response = controller.getStudents(SELECTED_PAGE, PAGE_SIZE);

        // Assert
        verify(studentService).getStudents(any(PaginationDto.class));
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(studentsPageDto));
    }

    @Test
    public void givenPaginationWhenGetStudentsWithoutCoursesThenReturnOk() {
        // Arrange
        final StudentsPageDto studentsPageDto = new StudentsPageDto();
        when(studentService.getAllStudentsWithoutCourse(any(PaginationDto.class))).thenReturn(studentsPageDto);

        // Act
        final ResponseEntity<?> response = controller.getStudentsWithoutCourse(SELECTED_PAGE, PAGE_SIZE);

        // Assert
        verify(studentService).getAllStudentsWithoutCourse(any(PaginationDto.class));
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(studentsPageDto));
    }

    @Test
    public void givenStudentIdWhenGetStudentCoursesThenReturnOk() throws Exception {
        // Arrange
        final List<CourseStudentDto> studentCourses = Collections.emptyList();
        when(courseService.getStudentCourses(STUDENT_ID)).thenReturn(studentCourses);

        // Act
        final ResponseEntity<?> response = controller.getStudentCourses(STUDENT_ID);

        // Assert
        verify(courseService).getStudentCourses(STUDENT_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        errorCollector.checkThat(response.getBody(), equalTo(studentCourses));
    }

    @Test
    public void givenStudentIdWhenGetStudentFailsCoursesThenReturnFailed() throws Exception {
        // Arrange
        when(courseService.getStudentCourses(STUDENT_ID)).thenThrow(NotFoundException.class);

        // Act
        final ResponseEntity<?> response = controller.getStudentCourses(STUDENT_ID);

        // Assert
        verify(courseService).getStudentCourses(STUDENT_ID);
        errorCollector.checkThat(response.getStatusCode(), equalTo(HttpStatus.NOT_FOUND));
    }
}
