package com.metadata.school.api.service;

import com.metadata.school.api.dto.CourseDto;
import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.CoursesPageDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.entity.Course;
import com.metadata.school.api.entity.CourseStudent;
import com.metadata.school.api.entity.Student;
import com.metadata.school.api.exception.ForbiddenException;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.repository.CourseRepository;
import com.metadata.school.api.repository.CourseStudentRepository;
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

import static com.metadata.school.api.service.CourseService.MAX_STUDENTS_BY_COURSE;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class CourseServiceTest {

    private static final long COURSE_ID = 777;
    private static final long STUDENT_ID = 888;
    private static final String COURSE_NAME = "Mathematics";
    private static final String STUDENT_NAME = "Peter Parker";
    private static final Integer TOTAL_PAGES = 5;
    private static final Long TOTAL_ELEMENTS = 30L;
    private static final int PAGE_NUMBER = 1;
    private static final int TOTAL_PAGE_SIZE = 5;

    @Rule
    public ErrorCollector errorCollector = new ErrorCollector();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private StudentService studentService;

    @Mock
    private CourseStudentRepository courseStudentRepository;

    @Mock
    private Course courseMock;

    @Mock
    private Student studentMock;

    @InjectMocks
    private CourseService courseService;

    @Before
    public void setup() {
        when(studentMock.getCompleteName()).thenReturn(STUDENT_NAME);
        when(courseMock.getCourseName()).thenReturn(COURSE_NAME);
    }

    @Test
    public void givenCourseIdWhenGetCourseThenReturnCourseData() throws Exception {
        // Arrange
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));

        // Act
        final CourseDto courseDto = courseService.getCourse(COURSE_ID);

        // Assert
        verify(courseRepository).findById(COURSE_ID);
        errorCollector.checkThat(courseDto.getName(), equalTo(COURSE_NAME));
    }

    @Test
    public void givenValidCourseDataWhenAddCourseThenShouldBeSuccess() throws Exception {
        // Arrange
        final CourseDto courseData = buildCourseDto();
        when(courseRepository.save(any(Course.class))).thenReturn(courseMock);

        // Act
        courseService.addCourse(courseData);

        // Assert
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    public void givenInvalidCourseDataWhenAddCourseThenShouldFail() throws Exception {
        // Act && Assert
        expectedException.expect(InvalidParametersException.class);
        expectedException.expectMessage("Required course data is null!");

        courseService.addCourse(null);
    }

    @Test
    public void givenValidCourseDataWhenUpdateCourseThenShouldBeSuccess() throws Exception {
        // Arrange
        final CourseDto courseData = buildCourseDto();
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));
        when(courseRepository.save(courseMock)).thenReturn(courseMock);

        // Act
        courseService.updateCourse(COURSE_ID, courseData);

        // Assert
        verify(courseRepository).save(courseMock);
    }

    @Test
    public void givenInvalidCourseIdWhenUpdateCourseThenShouldFail() throws Exception {
        // Arrange
        final CourseDto courseData = buildCourseDto();
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.empty());

        // Act && Assert
        expectedException.expect(InvalidParametersException.class);
        expectedException.expectMessage(String.format("Unable to update the given course, Course %s not found",
                COURSE_ID));

        courseService.updateCourse(COURSE_ID, courseData);
    }

    @Test
    public void givenValidCourseIdWhenDeleteCourseThenShouldBeSuccess() throws Exception {
        // Arrange
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));

        // Act
        courseService.deleteCourse(COURSE_ID);

        // Assert
        verify(courseRepository).delete(courseMock);
    }

    @Test
    public void givenInvalidCourseIdWhenDeleteCourseThenShouldFail() throws Exception {
        // Arrange
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.empty());

        // Act && Assert
        expectedException.expect(InvalidParametersException.class);
        expectedException.expectMessage(String.format("Unable to delete the given course, Course %s not found",
                COURSE_ID));

        courseService.deleteCourse(COURSE_ID);
    }

    @Test
    public void givenValidCourseIdWhenDeleteCourseWithStudentsThenShouldFail() throws Exception {
        // Arrange
        when(courseStudentRepository.existsByCourse(courseMock)).thenReturn(true);
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));

        // Act && Assert
        expectedException.expect(ForbiddenException.class);
        expectedException.expectMessage("Course has students associated");

        courseService.deleteCourse(COURSE_ID);
    }

    @Test
    public void givenCourseIdWhenGetCourseStudentsThenShouldReturnStudentsList() throws Exception {
        // Arrange
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));
        final List<CourseStudent> courseStudentsEntities = buildCourseStudentList();
        when(courseStudentRepository.getAllByCourse(courseMock)).thenReturn(courseStudentsEntities);

        // Act
        final List<CourseStudentDto> courseStudents = courseService.getCourseStudents(COURSE_ID);

        // Assert
        verify(courseRepository).findById(COURSE_ID);
        verify(courseStudentRepository).getAllByCourse(courseMock);
        errorCollector.checkThat(courseStudentsEntities.size(), equalTo(courseStudents.size()));
    }

    @Test
    public void givenStudentIdWhenGetStudentCoursesThenShouldReturnCoursesList() throws Exception {
        // Arrange
        when(studentService.findStudent(STUDENT_ID)).thenReturn(studentMock);
        final List<CourseStudent> courseStudentsEntities = buildCourseStudentList();
        when(courseStudentRepository.getAllByStudent(studentMock)).thenReturn(courseStudentsEntities);

        // Act
        final List<CourseStudentDto> courseStudents = courseService.getStudentCourses(STUDENT_ID);

        // Assert
        verify(studentService).findStudent(STUDENT_ID);
        verify(courseStudentRepository).getAllByStudent(studentMock);
        errorCollector.checkThat(courseStudentsEntities.size(), equalTo(courseStudents.size()));
    }

    @Test
    public void givenValidCourseAndStudentWhenRegisterStudentThenShouldBeSuccess() throws Exception {
        // Arrange
        when(studentService.findStudent(STUDENT_ID)).thenReturn(studentMock);
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));

        // Act
        courseService.registerStudentInCourse(COURSE_ID, STUDENT_ID);

        // Assert
        verify(studentService).findStudent(STUDENT_ID);
        verify(courseRepository).findById(COURSE_ID);
        verify(courseStudentRepository).findDistinctFirstByCourseAndStudent(courseMock, studentMock);
        verify(courseStudentRepository).countByCourse(courseMock);
        verify(courseStudentRepository).save(any(CourseStudent.class));
    }

    @Test
    public void givenValidCourseButStudentSubscribedWhenRegisterStudentThenShouldFail() throws Exception {
        // Arrange
        when(studentService.findStudent(STUDENT_ID)).thenReturn(studentMock);
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));
        when(courseStudentRepository.findDistinctFirstByCourseAndStudent(courseMock, studentMock))
                .thenReturn(mock(CourseStudent.class));

        // Act && Assert
        expectedException.expect(ForbiddenException.class);
        expectedException.expectMessage(String.format("Student %s is already registered in the course %s",
                STUDENT_NAME, COURSE_NAME));

        courseService.registerStudentInCourse(COURSE_ID, STUDENT_ID);
    }

    @Test
    public void givenMaxLimitSubscriptionsByCourseWhenRegisterStudentThenShouldFail() throws Exception {
        // Arrange
        when(studentService.findStudent(STUDENT_ID)).thenReturn(studentMock);
        when(courseRepository.findById(COURSE_ID)).thenReturn(Optional.of(courseMock));
        when(courseStudentRepository.countByCourse(courseMock)).thenReturn(MAX_STUDENTS_BY_COURSE + 1);

        // Act && Assert
        expectedException.expect(ForbiddenException.class);
        expectedException.expectMessage(String.format("The course only allow %s students subscribed!",
                MAX_STUDENTS_BY_COURSE));

        courseService.registerStudentInCourse(COURSE_ID, STUDENT_ID);
    }

    @Test
    public void givenPaginationWhenGetCoursesThenReturnListOfCourses() {
        // Arrange
        final List<Course> coursesList = Collections.singletonList(courseMock);
        final Page coursesPage = mock(Page.class);
        when(coursesPage.getTotalElements()).thenReturn(TOTAL_ELEMENTS);
        when(coursesPage.getTotalPages()).thenReturn(TOTAL_PAGES);
        when(coursesPage.toList()).thenReturn(coursesList);
        when(courseRepository.findAllByOrderById(any(Pageable.class))).thenReturn(coursesPage);
        final PaginationDto paginationDto = new PaginationDto(PAGE_NUMBER, TOTAL_PAGE_SIZE);

        // Act
        final CoursesPageDto coursesPageDto = courseService.getCourses(paginationDto);

        // Assert
        verify(courseRepository).findAllByOrderById(any(Pageable.class));
        errorCollector.checkThat(coursesPageDto.getTotalPages(), equalTo(TOTAL_PAGES));
        errorCollector.checkThat(coursesPageDto.getTotalElements(), equalTo(TOTAL_ELEMENTS));
        errorCollector.checkThat(coursesPageDto.getCourses().size(), equalTo(coursesList.size()));
    }

    @Test
    public void givenPaginationWhenGetCoursesWithoutStudentsThenReturnListOfCourses() {
        // Arrange
        final List<Course> coursesList = Collections.singletonList(courseMock);
        final Page coursesPage = mock(Page.class);
        when(coursesPage.getTotalElements()).thenReturn(TOTAL_ELEMENTS);
        when(coursesPage.getTotalPages()).thenReturn(TOTAL_PAGES);
        when(coursesPage.toList()).thenReturn(coursesList);
        when(courseRepository.findAllWithoutStudents(any(Pageable.class))).thenReturn(coursesPage);
        final PaginationDto paginationDto = new PaginationDto(PAGE_NUMBER, TOTAL_PAGE_SIZE);

        // Act
        final CoursesPageDto coursesPageDto = courseService.getAllCoursesWithoutStudents(paginationDto);

        // Assert
        verify(courseRepository).findAllWithoutStudents(any(Pageable.class));
        errorCollector.checkThat(coursesPageDto.getTotalPages(), equalTo(TOTAL_PAGES));
        errorCollector.checkThat(coursesPageDto.getTotalElements(), equalTo(TOTAL_ELEMENTS));
        errorCollector.checkThat(coursesPageDto.getCourses().size(), equalTo(coursesList.size()));
    }

    private CourseDto buildCourseDto() {
        return CourseDto.builder()
                .id(COURSE_ID)
                .name("Course - 1")
                .credits(2)
                .teacherName("The teacher")
                .build();
    }

    private List<CourseStudent> buildCourseStudentList() {
        return Collections.singletonList(
                CourseStudent.builder()
                        .course(mock(Course.class))
                        .student(mock(Student.class))
                        .build()
        );
    }
}
