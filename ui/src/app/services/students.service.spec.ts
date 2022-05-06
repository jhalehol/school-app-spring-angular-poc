import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';

import { StudentsService } from './students.service';
import { LoginComponent } from '../components/login/login.component';
import { StudentsComponent } from '../components/students/students.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { StudentCoursesComponent } from '../components/student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../components/course-registration/course-registration.component';
import { AppRoutingModule } from '../app-routing.module';
import { Student } from '../entities/student';
import { PaginationData } from '../entities/pagination-data';
import { CourseStudent } from '../entities/course-student';

describe('StudentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      MatTableModule,
      MatCheckboxModule,
      HttpClientModule,
      AppRoutingModule,
      MatCardModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      FormsModule,
      MatMenuModule,
      MatPaginatorModule,
      MatSnackBarModule
    ],
    declarations: [
      LoginComponent,
      StudentsComponent,
      CoursesComponent,
      StudentCoursesComponent,
      CourseRegistrationComponent
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/' }
    ]
  }));

  const STUDENT_NAME = 'Peter';
  const STUDENT_ID = '993K-1113';

  function buildStudent(): Student {
    const studentMock: Student = new Student();
    studentMock.name = STUDENT_NAME;
    studentMock.id = STUDENT_ID;
    return studentMock;
  }

  const COMMON_RESPONSE: any = {};
  const responseInterceptorSpy: any = {
    processApiResponse: jasmine.createSpy('processApiResponse').and.returnValue(of(COMMON_RESPONSE)),
    processApiError: jasmine.createSpy('processApiError').and.returnValue(of(COMMON_RESPONSE))
  };

  function assertCommonApi(httpClientSpy, response) {
    expect(httpClientSpy.get).toHaveBeenCalled();
    expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(response);
  }

  it('should be created', () => {
    const service: StudentsService = TestBed.get(StudentsService);
    expect(service).toBeTruthy();
  });

  it('when get student then should call required services', () => {
    // Arrange
    const student: Student = buildStudent();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of(student))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getStudent(STUDENT_ID)
      .subscribe(result => {
        assertCommonApi(httpClientSpy, student);
      });
  });

  it('when get students courses then should call required services', () => {
    // Arrange
    const studentCourse: CourseStudent = new CourseStudent();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of([studentCourse]))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getStudentsCourses(STUDENT_ID)
      .subscribe(result => {
        assertCommonApi(httpClientSpy, [studentCourse]);
      });
  });

  it('when get students without courses then should call required services', () => {
    // Arrange
    const student: Student = buildStudent();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of([student]))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getStudentsWithoutCourses(new PaginationData())
      .subscribe(result => {
        assertCommonApi(httpClientSpy, [student]);
      });
  });

  it('when get students then should call required services', () => {
    // Arrange
    const student: Student = buildStudent();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of([student]))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getStudents(new PaginationData())
      .subscribe(result => {
        assertCommonApi(httpClientSpy, [student]);
      });
  });

  it('when add student then should call required services', () => {
    // Arrange
    const student: Student = buildStudent();
    const httpClientSpy: any = {
      post: jasmine.createSpy('post').and.returnValue(of([student]))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.addStudent(student)
      .subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(student);
        expect(result).toBeDefined();
      });
  });

  it('when update student then should call required services', () => {
    // Arrange
    const student: Student = buildStudent();
    const httpClientSpy: any = {
      put: jasmine.createSpy('put').and.returnValue(of([student]))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.updateStudent(STUDENT_ID, student)
      .subscribe(result => {
        expect(httpClientSpy.put).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(student);
        expect(result).toBeDefined();
      });
  });

  it('when delete student then should call required services', () => {
    // Arrange
    const httpClientSpy: any = {
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };
    const service: StudentsService = new StudentsService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.deleteStudent(STUDENT_ID)
      .subscribe(result => {
        expect(httpClientSpy.delete).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalled();
      });
  });
});
