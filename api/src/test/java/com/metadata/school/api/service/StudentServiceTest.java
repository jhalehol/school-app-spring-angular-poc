package com.metadata.school.api.service;

import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.dto.StudentDto;
import com.metadata.school.api.dto.StudentsPageDto;
import com.metadata.school.api.entity.Student;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.repository.StudentRepository;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ErrorCollector;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class StudentServiceTest {

    private static final Long STUDENT_ID = 777L;
    private static final String STUDENT_ID_NUMBER = "76033008";
    private static final String STUDENT_NAME = "Will Smith";
    private static final Integer TOTAL_PAGES = 5;
    private static final Long TOTAL_ELEMENTS = 30L;
    private static final int PAGE_NUMBER = 1;
    private static final int TOTAL_PAGE_SIZE = 5;

    @Rule
    public ErrorCollector errorCollector = new ErrorCollector();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private Student studentMock;

    @InjectMocks
    private StudentService studentService;

    @Before
    public void setup() {
        when(studentMock.getId()).thenReturn(STUDENT_ID);
        when(studentMock.getName()).thenReturn(STUDENT_NAME);
    }

    @Test
    public void givenExistingStudentIdWhenGetStudentThenReturnStudent() throws Exception {
        // Arrange
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(studentMock));

        // Act
        final StudentDto result = studentService.getStudent(STUDENT_ID);

        // Assert
        verify(studentRepository).findById(STUDENT_ID);
        errorCollector.checkThat(result.getId(), equalTo(STUDENT_ID));
        errorCollector.checkThat(result.getName(), equalTo(STUDENT_NAME));
    }

    @Test
    public void givenNonExistingStudentIdWhenGetStudentThenReturnStudent() throws Exception {
        // Arrange
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.empty());

        // Act && Assert
        expectedException.expect(NotFoundException.class);
        expectedException.expectMessage(String.format("Student %s not found", STUDENT_ID));

        studentService.findStudent(STUDENT_ID);
    }

    @Test
    public void givenValidStudentDataWhenAddStudentThenShouldBeSuccess() throws Exception {
        // Arrange
        final StudentDto studentDto = buildStudentDto();

        // Act
        studentService.addStudent(studentDto);

        // Assert
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    public void givenInvalidStudentDataWhenAddStudentThenShouldFail() throws Exception {
        // Act && Assert
        expectedException.expect(InvalidParametersException.class);
        expectedException.expectMessage("Student data cannot be empty!");

        studentService.addStudent(null);
    }

    @Test
    public void givenValidStudentDataWhenUpdateStudentThenShouldBeSuccess() throws Exception {
        // Arrange
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(studentMock));
        final StudentDto studentDto = buildStudentDto();

        // Act
        studentService.updateStudent(STUDENT_ID, studentDto);

        // Assert
        verify(studentRepository).save(studentMock);
    }

    @Test
    public void givenValidStudentIdWhenDeleteStudentThenShouldBeSuccess() throws Exception {
        // Arrange
        when(studentRepository.findById(STUDENT_ID)).thenReturn(Optional.of(studentMock));

        // Act
        studentService.deleteStudent(STUDENT_ID);

        // Assert
        verify(studentRepository).delete(studentMock);
    }

    @Test
    public void givenPaginationWhenGetStudentsThenReturnListOfStudents() {
        // Arrange
        final List<Student> studentList = Collections.singletonList(
                Student.builder()
                        .id(STUDENT_ID)
                        .name(STUDENT_NAME)
                        .idNumber(STUDENT_ID_NUMBER)
                        .build()
        );
        final Page studentPage = mock(Page.class);
        when(studentPage.getTotalElements()).thenReturn(TOTAL_ELEMENTS);
        when(studentPage.getTotalPages()).thenReturn(TOTAL_PAGES);
        when(studentPage.toList()).thenReturn(studentList);
        when(studentRepository.findAll(any(Pageable.class))).thenReturn(studentPage);
        final PaginationDto paginationDto = new PaginationDto(PAGE_NUMBER, TOTAL_PAGE_SIZE);

        // Act
        final StudentsPageDto studentsPageDto = studentService.getStudents(paginationDto);

        // Assert
        verify(studentRepository).findAll(any(Pageable.class));
        errorCollector.checkThat(studentsPageDto.getTotalPages(), equalTo(TOTAL_PAGES));
        errorCollector.checkThat(studentsPageDto.getTotalElements(), equalTo(TOTAL_ELEMENTS));
        errorCollector.checkThat(studentsPageDto.getStudents().size(), equalTo(studentList.size()));
    }

    public StudentDto buildStudentDto() {
        return StudentDto.builder()
                .id(STUDENT_ID)
                .idNumber(STUDENT_ID_NUMBER)
                .name(STUDENT_NAME)
                .build();
    }
}
