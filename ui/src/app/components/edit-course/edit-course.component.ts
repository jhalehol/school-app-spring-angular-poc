import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ErrorFormMatcher } from '../../validators/error-form-matcher';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AppConstants } from '../../common/app-constants';
import { ApiResponse } from '../../entities/api-response';
import { EntityCrudResult } from '../../entities/entity-crud-result';
import { MessagesService } from '../../services/messages-service';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../entities/course';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {


  formMatcher = new ErrorFormMatcher();
  courseDataForm: FormGroup;
  currentId: string;

  constructor(private editDialogRef: MatDialogRef<EditCourseComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: any,
              private formBuilder: FormBuilder,
              private courseService: CoursesService,
              private router: Router,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.buildFormControls();
    if (this.dialogData.idCourse) {
      this.currentId = this.dialogData.idCourse;
      this.loadCourseData(this.currentId);
    }
  }

  buildFormControls() {
    this.courseDataForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      teacherName: new FormControl(''),
      credits: new FormControl('', )
    });
  }

  isRequiredFieldWithError(control: string): boolean {
    if (this.courseDataForm) {
      const formControl = this.courseDataForm.controls[control];
      if (formControl) {
        return formControl.hasError(AppConstants.FORM_VALIDATIONS.REQUIRED);
      }
    }

    return false;
  }

  formWithErrors(): boolean {
    return this.isRequiredFieldWithError('name');
  }

  saveCourse() {
    if (this.currentId) {
      this.updateCourse();
    } else {
      this.addCourse();
    }
  }

  updateCourse() {
    const course: Course = this.getCourseFromForm();
    this.courseService.updateCourse(this.currentId, course)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showCrudErrorMessage(response.errorMessage);
        } else {
          this.messagesService.showCrudCompleted();
          this.closeCourseEdition(response.data, AppConstants.FORM_ACTION.UPDATE);
        }
      });
  }

  addCourse() {
    const course: Course = this.getCourseFromForm();
    this.courseService.addCourse(course)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.messagesService.showCrudErrorMessage(response.errorMessage);
        } else {
          this.messagesService.showCrudCompleted();
          this.closeCourseEdition(response.data, AppConstants.FORM_ACTION.ADD);
        }
      });
  }

  getCourseFromForm(): Course {
    return this.courseDataForm.value;
  }

  loadCourseData(idCourse: string) {
    this.courseService.getCourse(idCourse)
      .subscribe((response: ApiResponse) => {
        if (response.hasError) {
          this.closeCourseEdition();
          const message: string = `Unable to load course data, details: ${response.errorMessage}`;
          this.messagesService.showErrorMessage(message);
        } else {
          const course: Course = response.data;
          this.courseDataForm.setValue({
            name: course.name,
            teacherName: course.teacherName,
            credits: course.credits
          });
        }
      });
  }

  closeCourseEdition(entity?: Course, action?: string) {
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
