import { Component, OnInit } from '@angular/core';
import { CourseStudent} from '../../entities/course-student';
import { CoursesService } from '../../services/courses.service';
import { StudentsService } from '../../services/students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../../services/messages-service';
import { ApiResponse } from '../../entities/api-response';
import { Course } from '../../entities/course';
import { Student } from '../../entities/student';
import { AppPaths } from '../../common/app-paths';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCoursesComponent implements OnInit {

  public static MODE_KEY = 'mode';
  public static ENTITY_ID = 'id';
  public static COURSE_STUDENTS_MODE = 'course_students';
  public static STUDENTS_COURSE_MODE = 'student_courses';
  public static COURSES_ALLOWED_PER_STUDENT = 5;

  mode: string;
  entityId: string;
  listColumnsStudents: string[] = ['id', 'name', 'email', 'address'];
  courseStudentsList: CourseStudent[] = [];
  listColumnsCourses: string[] = ['id', 'name', 'teacherName', 'credits'];
  studentCoursesList: CourseStudent[] = [];
  course: Course = new Course();
  student: Student = new Student();

  constructor(private courseService: CoursesService,
              private studentService: StudentsService,
              private activatedRoute: ActivatedRoute,
              private messagesService: MessagesService,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.mode = params[StudentCoursesComponent.MODE_KEY];
      this.entityId = params[StudentCoursesComponent.ENTITY_ID];
      this.loadList();
    });
  }

  isCourseStudentsListMode() {
    return this.mode === 'course_students';
  }

  isStudentCoursesListMode() {
    return !this.isCourseStudentsListMode();
  }

  loadList() {
    if (this.mode === StudentCoursesComponent.STUDENTS_COURSE_MODE) {
      this.loadStudentCourses();
    } else if (this.mode === StudentCoursesComponent.COURSE_STUDENTS_MODE) {
      this.loadCourseStudents();
    } else {
      this.messagesService.showErrorMessage(`Unsupported mode ${this.mode}`);
    }
  }

  loadCourseStudents() {
    this.courseService.getCourse(this.entityId)
      .subscribe((responseCourse: ApiResponse) => {
        if (responseCourse.hasError) {
          this.messagesService
            .showErrorMessage(`Unable to load course with ID ${this.entityId}, details: ${responseCourse.errorMessage}`);
        } else {
          this.course = responseCourse.data;
          this.courseService.getCourseStudents(this.entityId)
            .subscribe((responseStudents: ApiResponse) => {
              if (responseStudents.hasError) {
                this.messagesService
                  .showErrorMessage(`Unable to load students for course, details: ${responseStudents.errorMessage}`);
              } else {
                this.courseStudentsList = responseStudents.data;
              }
            });
        }
      });
  }

  loadStudentCourses() {
    this.studentService.getStudent(this.entityId)
      .subscribe((responseStudent: ApiResponse) => {
        if (responseStudent.hasError) {
          this.messagesService
            .showErrorMessage(`Unable to load student with ID ${this.entityId}, details: ${responseStudent.errorMessage}`);
        } else {
          this.student = responseStudent.data;
          this.studentService.getStudentsCourses(this.entityId)
            .subscribe((responseCourses: ApiResponse) => {
              if (responseCourses.hasError) {
                this.messagesService
                  .showErrorMessage(`Unable to load courses for student, details: ${responseCourses.errorMessage}`);
              } else {
                this.studentCoursesList = responseCourses.data;
              }
            });
        }
      });
  }

  allowAddStudentCourses() {
    const maxCoursesReached = this.studentCoursesList.length >= StudentCoursesComponent.COURSES_ALLOWED_PER_STUDENT;
    const validStudent = this.student !== undefined;
    return validStudent && !maxCoursesReached;
  }

  addStudentCourses() {
    this.router.navigate([AppPaths.UI.SUBSCRIBE_COURSES, {
      studentId: this.student.id
    }]);
  }
}
