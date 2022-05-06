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

import { LoginComponent } from '../components/login/login.component';
import { StudentsComponent } from '../components/students/students.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { StudentCoursesComponent } from '../components/student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../components/course-registration/course-registration.component';
import { AppRoutingModule } from '../app-routing.module';
import { CoursesService } from './courses.service';
import { PaginationData } from '../entities/pagination-data';
import { Course } from '../entities/course';
import { CoursesPage } from '../entities/courses-page';
import { CourseRegistrationResult } from '../entities/course-registration-result';

describe('CoursesService', () => {
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

  it('should be created', () => {
    const service: CoursesService = TestBed.get(CoursesService);
    expect(service).toBeTruthy();
  });
  const COURSE_NAME = 'Mathematics';
  const COURSE_ID = '777';
  const STUDENT_ID = '7732234';

  function buildCourse(): Course {
    const course: Course = new Course();
    course.name = COURSE_NAME;
    course.id = COURSE_ID;
    return course;
  }

  const COMMON_RESPONSE: any = {};
  const responseInterceptorSpy: any = {
    processApiResponse: jasmine.createSpy('processApiResponse').and.returnValue(of(COMMON_RESPONSE)),
    processApiError: jasmine.createSpy('processApiError').and.returnValue(of(COMMON_RESPONSE))
  };

  function assertCommonApi(httpClientSpy, response, result) {
    expect(httpClientSpy.get).toHaveBeenCalled();
    expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(response);
    expect(result).toBeDefined();
  }

  it('when get course then should call required services', () => {
    // Arrange
    const course: Course = buildCourse();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of(course))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getCourse(COURSE_ID)
      .subscribe(result => {
        assertCommonApi(httpClientSpy, course, result);
      });
  });

  it('when get courses then should call required services', () => {
    // Arrange
    const course: Course = buildCourse();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of([course]))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getCourses(new PaginationData())
      .subscribe(result => {
        assertCommonApi(httpClientSpy, [course], result);
      });
  });

  it('when get courses without students then should call required services', () => {
    // Arrange
    const coursesPage: CoursesPage = new CoursesPage();
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of(coursesPage))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getCoursesWithoutStudents(new PaginationData())
      .subscribe(result => {
        assertCommonApi(httpClientSpy, coursesPage, result);
      });
  });

  it('when get courses available then should call required services', () => {
    // Arrange
    const course: Course = buildCourse();
    const listCourses = [course];
    const httpClientSpy: any = {
      get: jasmine.createSpy('get').and.returnValue(of(listCourses))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.getCoursesAvailableForStudent(STUDENT_ID)
      .subscribe(result => {
        assertCommonApi(httpClientSpy, listCourses, result);
      });
  });

  it('when subscribe student in course then should call required services', () => {
    // Arrange
    const coursesIds: [string] = [COURSE_ID];
    const registrationResult: [CourseRegistrationResult] = [new CourseRegistrationResult()];
    const httpClientSpy: any = {
      post: jasmine.createSpy('post').and.returnValue(of(registrationResult))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.subscribeStudentInCourses(STUDENT_ID, coursesIds)
      .subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(registrationResult);
        expect(result).toBeDefined();
      });
  });

  it('when add student then should call required services', () => {
    // Arrange
    const course: Course = buildCourse();
    const httpClientSpy: any = {
      post: jasmine.createSpy('post').and.returnValue(of(course))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.addCourse(course)
      .subscribe(result => {
        expect(httpClientSpy.post).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(course);
        expect(result).toBeDefined();
      });
  });

  it('when update student then should call required services', () => {
    // Arrange
    const course: Course = buildCourse();
    const httpClientSpy: any = {
      put: jasmine.createSpy('put').and.returnValue(of(course))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.updateCourse(COURSE_ID, course)
      .subscribe(result => {
        expect(httpClientSpy.put).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalledWith(course);
        expect(result).toBeDefined();
      });
  });

  it('when delete student then should call required services', () => {
    // Arrange
    const httpClientSpy: any = {
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };
    const service: CoursesService = new CoursesService(httpClientSpy, responseInterceptorSpy);

    // Act && Assert
    service.deleteCourse(COURSE_ID)
      .subscribe(result => {
        expect(httpClientSpy.delete).toHaveBeenCalled();
        expect(responseInterceptorSpy.processApiResponse).toHaveBeenCalled();
      });
  });
});
