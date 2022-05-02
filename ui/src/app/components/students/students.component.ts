import {Component, OnInit, ViewChild} from '@angular/core';
import {StudentsService} from '../../services/students.service';
import {MatDialog, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {AppConstants} from '../../common/app-constants';
import {PaginationData} from '../../entities/pagination-data';
import {StudentsPage} from '../../entities/students-page';
import {Student} from '../../entities/student';
import {ApiResponse} from '../../entities/api-response';
import {EditStudentComponent} from '../edit-student/edit-student.component';
import {EntityCrudResult} from '../../entities/entity-crud-result';
import {MessagesService} from '../../services/messages-service';
import {ConfirmActionComponent} from '../confirm-action/confirm-action.component';
import {ConfirmAction} from '../../entities/confirm-action';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  listColumns: string[] = ['id', 'name', 'email', 'address', 'actions'];
  studentsDataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
  studentsList: Student[];
  selectedPage = 0;
  totalElements: number;
  pageSize: number = AppConstants.PAGINATION_DATA.DEFAULT_PAGE_SIZE;
  pageEvent: PageEvent;

  constructor(private studentService: StudentsService,
              private dialog: MatDialog,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(event?: PageEvent) {
    if (event) {
      this.selectedPage = event.pageIndex;
      this.pageSize = event.pageSize;
    } else {
      event = new PageEvent();
      event.pageIndex = this.selectedPage;
      event.pageSize = this.pageSize;
    }

    const pagination: PaginationData = new PaginationData();
    pagination.pageNumber = event.pageIndex;
    pagination.pageSize = event.pageSize;
    this.studentService.getStudents(pagination)
      .subscribe((response: ApiResponse) => {
        const studentsPage: StudentsPage = response.data;
        if (studentsPage && studentsPage.students) {
          this.studentsList = studentsPage.students;
          this.studentsDataSource.data = this.studentsList;
          this.totalElements = studentsPage.totalElements;
        }
    });

    return event;
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
        this.updateStudentDataFromList(result);
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
        this.deleteStudent(confirmAction.entity)
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
          console.log(JSON.stringify(result));
          this.updateStudentDataFromList(result);
        }
      });
  }

  updateStudentDataFromList(result: EntityCrudResult) {
    if (result) {
      const student: Student = result.entity;
      if (result.action === AppConstants.FORM_ACTION.ADD) {
        this.studentsList.push(student)
        this.totalElements += 1;
      } else {
        const studentIndex =
          this.studentsList.findIndex((studentFromList: Student) => studentFromList.id == student.id);
        if (studentIndex >= 0) {
          if (result.action === AppConstants.FORM_ACTION.UPDATE) {
            this.studentsList[studentIndex] = student;
          } else if (result.action === AppConstants.FORM_ACTION.DELETE){
            this.studentsList.splice(studentIndex, 1);
            this.totalElements -= 1;
            this.pageSize -= 1;
          }
        }
      }
    }

    this.studentsDataSource.data = this.studentsList;
  }
}
