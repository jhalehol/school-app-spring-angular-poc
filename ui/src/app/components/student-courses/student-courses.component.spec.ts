import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { LoginComponent } from '../login/login.component';
import { StudentsComponent } from '../students/students.component';
import { CoursesComponent } from '../courses/courses.component';
import { StudentCoursesComponent } from './student-courses.component';
import { CourseRegistrationComponent } from '../course-registration/course-registration.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('StudentCoursesComponent', () => {
  let component: StudentCoursesComponent;
  let fixture: ComponentFixture<StudentCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
        MatSnackBarModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        StudentsComponent,
        StudentCoursesComponent,
        LoginComponent,
        CoursesComponent,
        CourseRegistrationComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
