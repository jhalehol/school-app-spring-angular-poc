import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Course} from '../../entities/course';
import {SelectionModel} from '@angular/cdk/collections';
import {CoursesService} from '../../services/courses.service';
import {StudentsService} from '../../services/students.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../entities/api-response';
import {MessagesService} from '../../services/messages-service';
import {Student} from '../../entities/student';
import {AppPaths} from '../../common/app-paths';
import {StudentCoursesComponent} from '../student-courses/student-courses.component';
import {CourseRegistrationResult} from '../../entities/course-registration-result';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.css']
})
export class CourseRegistrationComponent implements OnInit {

  public STUDENT_ID_KEY = 'studentId';

  listColumns = ['select', 'id', 'name', 'teacherName', 'credits'];
  listDataSource = new MatTableDataSource<Course>();
  selection = new SelectionModel<Course>(true, []);
  studentId: string;
  student: Student = new Student();

  constructor(private courseService: CoursesService,
              private studentService: StudentsService,
              private activatedRoute: ActivatedRoute,
              private route: Router,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.studentId = params[this.STUDENT_ID_KEY];
      this.loadStudentData();
    });
  }

  loadStudentData() {
    this.studentService.getStudent(this.studentId)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showErrorMessage(`Unable to load student, details ${response.errorMessage}`);
        } else {
          this.student = response.data;
          this.loadCoursesAvailable();
        }
      });
  }

  loadCoursesAvailable() {
    this.courseService.getCoursesAvailableForStudent(this.studentId)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showErrorMessage(`Unable to load available courses, details: ${response.errorMessage}`);
        } else {
          this.listDataSource.data = response.data;
        }
      });
  }

  subscribeCourses() {
    const selectedCourses: string[] = this.listDataSource.data
      .map((course: Course) => {
      if (this.selection.isSelected(course)) {
        return course.id;
      }
    }).filter(id => {
      return id !== null && id !== undefined;
    });

    this.courseService.subscribeStudentInCourses(this.studentId, selectedCourses)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showErrorMessage(`Something failed trying to register the courses, ${response.errorMessage}`);
        } else {
          const results: CourseRegistrationResult[] = response.data;
          const totalCoursesSelected = selectedCourses.length;
          let successCourses = 0;
          let firstErrorResult = '';
          if (results) {
            results.forEach((result: CourseRegistrationResult) => {
              if (result.success) {
                successCourses += 1;
              } else {
                if (!firstErrorResult) {
                  firstErrorResult = ` ,details: ${result.details}`;
                }
              }
            });

            const message = `Total subscribed courses ${successCourses} of ${totalCoursesSelected} selected${firstErrorResult}`;
            this.messagesService.showMessage(message);
            this.route.navigate([AppPaths.UI.STUDENT_COURSES, {
              mode: StudentCoursesComponent.STUDENTS_COURSE_MODE,
              id: this.studentId
            }]);
          }
        }
      });
  }
}
