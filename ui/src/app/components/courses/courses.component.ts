import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';

import { AppConstants } from '../../common/app-constants';
import { PaginationData } from '../../entities/pagination-data';
import { ApiResponse } from '../../entities/api-response';
import { EntityCrudResult } from '../../entities/entity-crud-result';
import { MessagesService } from '../../services/messages-service';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { ConfirmAction } from '../../entities/confirm-action';
import { TableListDatasource } from '../../entities/table-list-datasource';
import { CrudViewUtil } from '../../common/crud-view-util';
import { Course } from '../../entities/course';
import { CoursesService } from '../../services/courses.service';
import { CoursesPage } from '../../entities/courses-page';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { AppPaths } from '../../common/app-paths';
import { StudentCoursesComponent } from '../student-courses/student-courses.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  listColumns: string[] = ['id', 'name', 'teacherName', 'credits', 'actions'];
  listDataSource: MatTableDataSource<Course> = new MatTableDataSource<Course>([]);
  pageEvent: PageEvent;
  withoutStudents: boolean;
  currentDataSource: TableListDatasource = new TableListDatasource();

  constructor(private coursesService: CoursesService,
              private dialog: MatDialog,
              private messagesService: MessagesService,
              private router: Router) {
  }

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses(event?: PageEvent) {
    this.getCourses(event)
      .subscribe((response: ApiResponse) => {
        const coursesPage: CoursesPage = response.data;
        if (coursesPage && coursesPage.courses) {
          this.currentDataSource.list = coursesPage.courses;
          this.listDataSource.data = coursesPage.courses;
          this.currentDataSource.totalElements = coursesPage.totalElements;
        }
      });

    return event;
  }

  filterChanged() {
    this.loadCourses();
  }

  getCourses(event?: PageEvent): Observable<ApiResponse> {
    if (event) {
      this.currentDataSource.selectedPage = event.pageIndex;
      this.currentDataSource.pageSize = event.pageSize;
    } else {
      event = new PageEvent();
      event.pageIndex = this.currentDataSource.selectedPage;
      event.pageSize = this.currentDataSource.pageSize;
    }

    const pagination: PaginationData = new PaginationData();
    pagination.pageNumber = event.pageIndex;
    pagination.pageSize = event.pageSize;

    if (this.withoutStudents) {
      return this.coursesService.getCoursesWithoutStudents(pagination);
    }

    return this.coursesService.getCourses(pagination);
  }

  addCourse() {
    this.openEditWindow();
  }

  editCourse(id: string) {
    this.openEditWindow(id);
  }

  openEditWindow(id?: string) {
    const dialogRef = this.dialog.open(EditCourseComponent, {
      data: {
        idCourse: id
      }
    });
    dialogRef.afterClosed().subscribe((result: EntityCrudResult) => {
      if (result) {
        this.updateDataFromList(result);
      }
    });
  }

  openDeleteConfirmation(course: Course) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        question: `Confirm action to delete course ${course.name}`,
        entity: course
      }
    });

    dialogRef.afterClosed().subscribe((confirmAction: ConfirmAction) => {
      if (confirmAction.confirm && confirmAction.entity) {
        this.deleteCourse(confirmAction.entity);
      }
    });

  }

  deleteCourse(course: Course) {
    this.coursesService.deleteCourse(course.id)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showCrudErrorMessage(response.errorMessage);
        } else {
          this.messagesService.showCrudCompleted();
          const result: EntityCrudResult = new EntityCrudResult();
          result.action = AppConstants.FORM_ACTION.DELETE;
          result.entity = course;
          this.updateDataFromList(result);
        }
      });
  }

  updateDataFromList(result: EntityCrudResult) {
    this.currentDataSource = CrudViewUtil.updateListFromCrudResult(result, this.currentDataSource);
    this.listDataSource.data = this.currentDataSource.list;
  }

  navigateToCourseStudents(course: Course) {
    // tslint:disable-next-line:max-line-length
    this.router.navigate([AppPaths.UI.STUDENT_COURSES, {
      mode: StudentCoursesComponent.COURSE_STUDENTS_MODE,
      id: course.id
    }]);
  }
}
