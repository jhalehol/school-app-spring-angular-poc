import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { AppPaths } from '../common/app-paths';
import { catchError, map } from 'rxjs/operators';

import { StudentsPage } from '../entities/students-page';
import { PaginationData } from '../entities/pagination-data';
import { Student } from '../entities/student';
import { ApiResponse } from '../entities/api-response';
import { ApiResponseInterceptor } from '../interceptors/api-response-interceptor';
import { AppConstants } from '../common/app-constants';


@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private responseInterceptor: ApiResponseInterceptor) { }

  public getStudents(pagination: PaginationData): Observable<ApiResponse> {
    return this.httpClient
      .get<StudentsPage>(`${AppPaths.API.STUDENTS_URL}/${pagination.pageNumber}/${pagination.pageSize}`)
      .pipe(
        map((data: StudentsPage) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public getStudentsWithoutCourses(pagination: PaginationData): Observable<ApiResponse> {
    return this.httpClient
      .get<StudentsPage>(`${AppPaths.API.STUDENTS_URL}/empty/${pagination.pageNumber}/${pagination.pageSize}`)
      .pipe(
        map((data: StudentsPage) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public getStudent(id: string): Observable<ApiResponse> {
    return this.httpClient
      .get<Student>(`${AppPaths.API.STUDENTS_URL}/${id}`)
      .pipe(
        map((data: Student) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        })
      );
  }

  public addStudent(student: Student): Observable<ApiResponse> {
    return this.httpClient.post(AppPaths.API.STUDENTS_URL, student, AppConstants.COMMON_HTTP_OPTIONS)
      .pipe(
        map((data: Student) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
        return of(this.responseInterceptor.processApiError(error));
      }));
  }

  public updateStudent(id: String, student: Student): Observable<ApiResponse> {
    return this.httpClient.put(`${AppPaths.API.STUDENTS_URL}/${id}`, student, AppConstants.COMMON_HTTP_OPTIONS)
      .pipe(
        map((data: Student) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        }));
  }

  public deleteStudent(id: String): Observable<ApiResponse> {
    return this.httpClient.delete(`${AppPaths.API.STUDENTS_URL}/${id}`)
      .pipe(
        map((data: any) => {
          return this.responseInterceptor.processApiResponse(data);
        }), catchError(error => {
          return of(this.responseInterceptor.processApiError(error));
        }));
  }
}
