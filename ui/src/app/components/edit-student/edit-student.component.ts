import {Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ErrorFormMatcher } from '../../validators/error-form-matcher';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Student } from '../../entities/student';
import { AppConstants } from '../../common/app-constants';
import { StudentsService } from '../../services/students.service';
import { ApiResponse } from '../../entities/api-response';
import { EntityCrudResult } from '../../entities/entity-crud-result';
import { MessagesService } from '../../services/messages-service';
import {CrudViewUtil} from '../../common/crud-view-util';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  formMatcher = new ErrorFormMatcher();
  studentDataForm: FormGroup;
  currentIdStudent: string;

  constructor(private editDialogRef: MatDialogRef<EditStudentComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any,
              private formBuilder: FormBuilder,
              private studentService: StudentsService,
              private router: Router,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.buildFormControls();
    if (this.dialogData.idStudent) {
      this.currentIdStudent = this.dialogData.idStudent;
      this.loadStudentData(this.currentIdStudent);
    }
  }

  buildFormControls() {
    this.studentDataForm = new FormGroup({
      idNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      surname: new FormControl('', [Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      address: new FormControl('', [Validators.maxLength(200)])
    });
  }


  isFieldWithError(control) {
    return CrudViewUtil.isRequiredFieldWithError(this.studentDataForm, control);
  }

  formWithErrors(): boolean {
    return this.isFieldWithError('idNumber') ||
      this.isFieldWithError('name') ||
      this.isFieldWithError('surname') ||
      this.isFieldWithError('email') ||
      this.isFieldWithError('address');
  }

  saveStudent() {
    if (this.currentIdStudent) {
      this.updateStudent();
    } else {
      this.addStudent();
    }
  }

  updateStudent() {
    const student: Student = this.getStudentFromForm();
    this.studentService.updateStudent(this.currentIdStudent, student)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showCrudErrorMessage(response.errorMessage);
        } else {
          this.messagesService.showCrudCompleted();
          this.closeStudentEdition(response.data, AppConstants.FORM_ACTION.UPDATE);
        }
      });
  }

  addStudent() {
    const student: Student = this.getStudentFromForm();
    this.studentService.addStudent(student)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showCrudErrorMessage(response.errorMessage);
        } else {
          this.messagesService.showCrudCompleted();
          this.closeStudentEdition(response.data, AppConstants.FORM_ACTION.ADD);
        }
      });
  }

  getStudentFromForm(): Student {
    return this.studentDataForm.value;
  }

  loadStudentData(idStudent: string) {
    this.studentService.getStudent(idStudent)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.closeStudentEdition();
          const message: string = `Unable to load student data, details: ${response.errorMessage}`;
          this.messagesService.showErrorMessage(message);
        } else {
          const student: Student = response.data;
          this.studentDataForm.setValue({
            idNumber: student.idNumber,
            name: student.name,
            surname: student.surname,
            email: student.email,
            address: student.address
          });
        }
    });
  }

  closeStudentEdition(entity?: Student, action?: string) {
    if (entity && action) {
      const result: EntityCrudResult = new EntityCrudResult();
      result.action = action;
      result.entity = entity;
      this.editDialogRef.close(result);
    } else {
      this.editDialogRef.close();
    }
  }
}
