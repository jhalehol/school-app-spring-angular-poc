import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../../services/students.service';
import { MatDialog, MatTableDataSource, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';

import { AppConstants } from '../../common/app-constants';
import { PaginationData } from '../../entities/pagination-data';
import { StudentsPage } from '../../entities/students-page';
import { Student } from '../../entities/student';
import { ApiResponse } from '../../entities/api-response';
import { EditStudentComponent } from '../edit-student/edit-student.component';
import { EntityCrudResult } from '../../entities/entity-crud-result';
import { MessagesService } from '../../services/messages-service';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
import { ConfirmAction } from '../../entities/confirm-action';
import { TableListDatasource } from '../../entities/table-list-datasource';
import { CrudViewUtil } from '../../common/crud-view-util';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  listColumns: string[] = ['id', 'name', 'email', 'address', 'actions'];
  listDataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
  pageEvent: PageEvent;
  withoutCourses: boolean;
  currentDataSource: TableListDatasource = new TableListDatasource();

  constructor(private studentService: StudentsService,
              private dialog: MatDialog,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(event?: PageEvent) {
    this.getStudents(event)
      .subscribe((response: ApiResponse) => {
        const studentsPage: StudentsPage = response.data;
        if (studentsPage && studentsPage.students) {
          this.currentDataSource.list = studentsPage.students;
          this.listDataSource.data = studentsPage.students;
          this.currentDataSource.totalElements = studentsPage.totalElements;
        }
    });

    return event;
  }

  filterChanged() {
    this.loadStudents();
  }

  getStudents(event?: PageEvent): Observable<ApiResponse> {
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

    if (this.withoutCourses) {
      return this.studentService.getStudentsWithoutCourses(pagination);
    }

    return this.studentService.getStudents(pagination);
  }

  addStudent() {
    this.openEditWindow();
  }

  editStudent(id: string) {
    this.openEditWindow(id);
  }

  openEditWindow(id?: string) {
    const dialogRef = this.dialog.open(EditStudentComponent, {
      data: {
        idStudent: id
      }
    });
    dialogRef.afterClosed().subscribe((result: EntityCrudResult) => {
      if (result) {
        this.updateDataFromList(result);
      }
    });
  }

  openDeleteConfirmation(student: Student) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        question: `Confirm action to delete student ${student.name} ${student.surname}`,
        entity: student
      }
    });

    dialogRef.afterClosed().subscribe((confirmAction: ConfirmAction) => {
      if (confirmAction.confirm && confirmAction.entity) {
        this.deleteStudent(confirmAction.entity);
      }
    });

  }

  deleteStudent(student: Student) {
    this.studentService.deleteStudent(student.id)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showCrudErrorMessage(response.errorMessage);
        } else {
          this.messagesService.showCrudCompleted();
          const result: EntityCrudResult = new EntityCrudResult();
          result.action = AppConstants.FORM_ACTION.DELETE;
          result.entity = student;
          this.updateDataFromList(result);
        }
      });
  }

  updateDataFromList(result: EntityCrudResult) {
    this.currentDataSource = CrudViewUtil.updateListFromCrudResult(result, this.currentDataSource);
    this.listDataSource.data = this.currentDataSource.list;
  }
}
