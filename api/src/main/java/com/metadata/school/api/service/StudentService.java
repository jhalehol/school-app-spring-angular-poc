package com.metadata.school.api.service;

import com.metadata.school.api.dto.PaginationDto;
import com.metadata.school.api.dto.StudentDto;
import com.metadata.school.api.dto.StudentsPageDto;
import com.metadata.school.api.entity.Student;
import com.metadata.school.api.exception.InvalidParametersException;
import com.metadata.school.api.exception.NotFoundException;
import com.metadata.school.api.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Get the student data
     * @param studentId Student identifier
     * @return
     * @throws NotFoundException
     */
    public StudentDto getStudent(final Long studentId) throws NotFoundException {
        return StudentDto.convertToDto(findStudent(studentId));
    }

    /**
     * Add a student into the repository
     * @param studentDto Object with student details
     * @throws InvalidParametersException
     */
    public void addStudent(final StudentDto studentDto) throws InvalidParametersException {
        validateStudentDto(studentDto);

        final Student student = Student.builder()
                .name(studentDto.getName())
                .surname(studentDto.getSurname())
                .address(studentDto.getAddress())
                .birthDate(studentDto.getBirthDate())
                .idNumber(studentDto.getIdNumber())
                .build();
        studentRepository.save(student);
    }

    /**
     * Update an existing student into the repository
     * @param studentDto Object with student details
     * @throws InvalidParametersException
     */
    public void updateStudent(final Long studentId, final StudentDto studentDto)
            throws InvalidParametersException {
        try {
            final Student student = findStudent(studentId);
            validateStudentDto(studentDto);

            student.setName(studentDto.getName());
            student.setSurname(studentDto.getSurname());
            student.setAddress(studentDto.getAddress());
            student.setBirthDate(studentDto.getBirthDate());
            student.setIdNumber(studentDto.getIdNumber());
            studentRepository.save(student);
        } catch (NotFoundException e) {
            throw new InvalidParametersException(String.format("Unable to update student data, %s", e.getMessage()));
        }
    }

    /**
     * Deletes an student from the repository
     * @param studentId Student identifier
     * @throws InvalidParametersException
     */
    public void deleteStudent(final Long studentId) throws InvalidParametersException {
        try {
            final Student student = findStudent(studentId);
            studentRepository.delete(student);
        } catch (NotFoundException e) {
            throw new InvalidParametersException(String.format("Unable to student, %s", e.getMessage()));
        }
    }

    /**
     * Gets the list of students according to the given pagination data
     * @param paginationData Data to paginate the results
     * @return
     */
    public StudentsPageDto getStudents(final PaginationDto paginationData) {
        final Pageable pageable = PageRequest.of(paginationData.getPageNumber(), paginationData.getPageSize());
        final Page<Student> studentsPage = studentRepository.findAll(pageable);
        final List<StudentDto> students = studentsPage.toList().stream()
                .map(StudentDto::convertToDto)
                .collect(Collectors.toList());

        return StudentsPageDto.builder()
                .totalElements(studentsPage.getTotalElements())
                .totalPages(studentsPage.getTotalPages())
                .students(students)
                .build();
    }

    Student findStudent(final Long studentId) throws NotFoundException {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException(String.format("Student %s not found", studentId)));
    }

    private void validateStudentDto(final StudentDto studentDto) throws InvalidParametersException {
        if (studentDto == null) {
            throw new InvalidParametersException("Student data cannot be empty!");
        }

        studentDto.validateData();
    }
}
