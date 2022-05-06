import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ApiResponseInterceptor } from '../interceptors/api-response-interceptor';
import { PaginationData } from '../entities/pagination-data';
import { ApiResponse } from '../entities/api-response';
import { AppPaths } from '../common/app-paths';
import { CoursesPage } from '../entities/courses-page';
import { Course } from '../entities/course';
import { AppConstants } from '../common/app-constants';
import { CourseStudent } from '../entities/course-student';
import { CourseRegistrationResult } from '../entities/course-registration-result';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private httpClient: HttpClient,
              private responseInterceptor: ApiResponseInterceptor) { }

  public getCourses(pagination: PaginationData): Observable<ApiResponse> {
    return this.httpClient
      .get<CoursesPage>(`${AppPaths.API.COURSES_URL}/${pagination.pageNumber}/${pagination.pageSize}`)
      .pipe(
        map((data: CoursesPage) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public getCoursesWithoutStudents(pagination: PaginationData): Observable<ApiResponse> {
    return this.httpClient
      .get<CoursesPage>(`${AppPaths.API.COURSES_URL}/empty/${pagination.pageNumber}/${pagination.pageSize}`)
      .pipe(
        map((data: CoursesPage) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public getCoursesAvailableForStudent(studentId: string): Observable<ApiResponse> {
    return this.httpClient
      .get<Course[]>(`${AppPaths.API.COURSES_URL}/available/${studentId}`)
      .pipe(
        map((data: Course[]) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public subscribeStudentInCourses(studentId: string, coursesIds: string[]): Observable<ApiResponse> {
    return this.httpClient
      .post(`${AppPaths.API.COURSES_URL}/register/${studentId}`, coursesIds, AppConstants.COMMON_HTTP_OPTIONS)
      .pipe(
        map((data: CourseRegistrationResult[]) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public getCourseStudents(courseId: string): Observable<ApiResponse> {
    return this.httpClient
      .get<CourseStudent[]>(`${AppPaths.API.COURSES_URL}/${courseId}/students`)
      .pipe(
        map((data: CourseStudent[]) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public getCourse(id: string): Observable<ApiResponse> {
    return this.httpClient
      .get<Course>(`${AppPaths.API.COURSES_URL}/${id}`)
      .pipe(
        map((data: Course) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public addCourse(course: Course): Observable<ApiResponse> {
    return this.httpClient.post(AppPaths.API.COURSES_URL, course, AppConstants.COMMON_HTTP_OPTIONS)
      .pipe(
        map((data: Course) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        }));
  }

  public updateCourse(id: String, course: Course): Observable<ApiResponse> {
    return this.httpClient.put(`${AppPaths.API.COURSES_URL}/${id}`, course, AppConstants.COMMON_HTTP_OPTIONS)
      .pipe(
        map((data: Course) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        }));
  }

  public deleteCourse(id: String): Observable<ApiResponse> {
    return this.httpClient.delete(`${AppPaths.API.COURSES_URL}/${id}`)
      .pipe(
        map((data: any) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        }));
  }
}
