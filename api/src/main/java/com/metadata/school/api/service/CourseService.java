package com.metadata.school.api.service;

import com.metadata.school.api.dto.CourseDto;
import com.metadata.school.api.dto.CourseRegistrationResultDto;
import com.metadata.school.api.dto.CourseStudentDto;
import com.metadata.school.api.dto.CoursesPageDto;
import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.dto.StudentDto;
import com.metadata.school.api.entity.Course;
import com.metadata.school.api.entity.CourseStudent;
import com.metadata.school.api.entity.Student;
import com.metadata.school.api.exception.ForbiddenException;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.repository.CourseRepository;
import com.metadata.school.api.repository.CourseStudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    static final long MAX_STUDENTS_BY_COURSE = 50;
    static final long MAX_COURSES_BY_STUDENT = 5;
    private final CourseRepository courseRepository;
    private final StudentService studentService;
    private final CourseStudentRepository courseStudentRepository;

    public CourseService(final CourseRepository courseRepository,
            final StudentService studentService, final CourseStudentRepository courseStudentRepository) {
        this.courseRepository = courseRepository;
        this.studentService = studentService;
        this.courseStudentRepository = courseStudentRepository;
    }

    /**
     * Retrieves the given course from the repository
     * @param courseId Course identifier
     * @return
     * @throws NotFoundException
     */
    public CourseDto getCourse(final Long courseId) throws NotFoundException {
        return CourseDto.convertToDto(findCourse(courseId));
    }

    /**
     * Add a course into the repository
     * @param courseDto Dto that contains the course data
     * @throws InvalidParametersException
     */
    public CourseDto addCourse(final CourseDto courseDto) throws InvalidParametersException {
        validateCourseDto(courseDto);
        final Course course = Course.builder()
                .courseName(courseDto.getName())
                .teacherName(courseDto.getTeacherName())
                .credits(courseDto.getCredits())
                .build();
        final Course courseAdded = courseRepository.save(course);
        return CourseDto.convertToDto(courseAdded);
    }

    /**
     * Updates a course into the repository
     * @param courseId Course identifier
     * @param courseDto Dto that contains the course data
     * @throws InvalidParametersException
     */
    public CourseDto updateCourse(final Long courseId, final CourseDto courseDto) throws InvalidParametersException {
        try {
            validateCourseDto(courseDto);
            final Course course = findCourse(courseId);
            course.setCourseName(courseDto.getName());
            course.setTeacherName(courseDto.getTeacherName());
            course.setCredits(courseDto.getCredits());
            return CourseDto.convertToDto(courseRepository.save(course));
        } catch (NotFoundException e) {
            throw new InvalidParametersException(String
                    .format("Unable to update the given course, %s", e.getMessage()));
        }
    }

    /**
     * Deletes the given course from the repository
     * @param courseId Course identifier
     */
    public void deleteCourse(final Long courseId) throws InvalidParametersException, ForbiddenException {
        try {
            final Course course = findCourse(courseId);
            final boolean studentAssociated = courseStudentRepository.existsByCourse(course);
            if (studentAssociated) {
                throw new ForbiddenException("Course has students associated");
            }

            courseRepository.delete(course);
        } catch (NotFoundException e) {
            throw new InvalidParametersException(String.format("Unable to delete the given course, %s",
                    e.getMessage()));
        }
    }

    /**
     * Get the list of all students subscribed in a course
     * @param courseId Course identifier
     * @return List of students in the given course
     * @throws NotFoundException
     */
    public List<CourseStudentDto> getCourseStudents(final Long courseId) throws NotFoundException {
        final Course course = findCourse(courseId);
        final List<CourseStudent> courseStudents = courseStudentRepository.getAllByCourse(course);
        return convertCourseStudents(courseStudents);
    }

    /**
     * Get the list of all courses subscribed for a student
     * @param studentId Student identifier
     * @return List of courses of the given student
     * @throws NotFoundException
     */
    public List<CourseStudentDto> getStudentCourses(final Long studentId) throws NotFoundException {
        final Student student = studentService.findStudent(studentId);
        List<CourseStudent> courseStudents = courseStudentRepository.getAllByStudent(student);
        return convertCourseStudents(courseStudents);
    }

    /**
     * Register the given student id into the given course
     * @param courses Courses identifier
     * @param studentId Student identifier
     * @throws NotFoundException
     */
    public List<CourseRegistrationResultDto> registerStudentInCourses(final Long studentId, final List<Long> courses)
            throws NotFoundException, ForbiddenException {
        final Student student = studentService.findStudent(studentId);
        final List<CourseRegistrationResultDto> results = new ArrayList<>();
        courses.forEach(courseId -> {
            if (courseId != null) {
                boolean success = true;
                String message = "";
                String courseName = "Not found";
                try {

                    final Course course = findCourse(courseId);
                    validateAllowedStudentInCourse(course, student);
                    final CourseStudent courseStudent = CourseStudent.builder()
                            .course(course)
                            .student(student)
                            .build();

                    courseStudentRepository.save(courseStudent);
                } catch (NotFoundException | ForbiddenException e) {
                    success = false;
                    message = e.getMessage();
                }

                results.add(CourseRegistrationResultDto.builder()
                        .courseId(courseId)
                        .studentId(studentId)
                        .courseName(courseName)
                        .success(success)
                        .details(message)
                        .build());
            }
        });

        return results;
    }

    /**
     * Get all courses without students assigned
     * @return List of courses
     */
    public CoursesPageDto getAllCoursesWithoutStudents(final PaginationDto paginationData) {
        final Pageable pageable = paginationData.toPageable();
        final Page<Course> coursesPage = courseRepository.findAllWithoutStudents(pageable);
        return CoursesPageDto.convertToDto(coursesPage);
    }

    /**
     * Get all courses list according to the given pagination
     * @param paginationData Pagination data used to retrieve the results
     * @return
     */
    public CoursesPageDto getCourses(final PaginationDto paginationData) {
        final Pageable pageable = paginationData.toPageable();
        final Page<Course> coursesPage = courseRepository.findAllByOrderById(pageable);
        return CoursesPageDto.convertToDto(coursesPage);
    }

    /**
     * Return the list of courses available for subscription for the given student
     * @param studentId Student identifier
     * @return List of courses
     * @throws NotFoundException
     */
    public List<CourseDto> getAllAvailableForStudent(final Long studentId) throws NotFoundException {
        final Student student = studentService.findStudent(studentId);
        return courseRepository.findAllAvailableForStudent(student.getId())
                .stream()
                .map(CourseDto::convertToDto)
                .collect(Collectors.toList());
    }

    private List<CourseStudentDto> convertCourseStudents(List<CourseStudent> courseStudents) {
        return courseStudents.stream()
                .map(courseStudent -> CourseStudentDto.builder()
                        .course(CourseDto.convertToDto(courseStudent.getCourse()))
                        .student(StudentDto.convertToDto(courseStudent.getStudent()))
                        .build())
                .collect(Collectors.toList());
    }

    private void validateCourseDto(final CourseDto courseDto) throws InvalidParametersException {
        if (courseDto == null) {
            throw new InvalidParametersException("Required course data is null!");
        }

        courseDto.validateData();
    }

    Course findCourse(final Long courseId) throws NotFoundException {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new NotFoundException(String.format("Course %s not found", courseId)));
    }

    private void validateAllowedStudentInCourse(final Course course, final Student student) throws ForbiddenException {
        final Optional<CourseStudent> courseStudent = Optional.ofNullable(courseStudentRepository
                .findDistinctFirstByCourseAndStudent(course, student));
        if (courseStudent.isPresent()) {
            throw new ForbiddenException(String.format("Student %s is already registered in the course %s",
                    student.getCompleteName(), course.getCourseName()));
        }

        final long totalStudentCourses = courseStudentRepository.countByStudent(student);
        if (totalStudentCourses >= MAX_COURSES_BY_STUDENT) {
            throw new ForbiddenException(String.format("Only %s courses are allowed per student",
                    MAX_COURSES_BY_STUDENT));
        }

        final long totalStudentsInCourse = courseStudentRepository.countByCourse(course);
        if (totalStudentsInCourse >= MAX_STUDENTS_BY_COURSE) {
            throw new ForbiddenException(String.format("The course only allow %s students subscribed",
                    MAX_STUDENTS_BY_COURSE));
        }
    }
}
