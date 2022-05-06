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

import { CourseRegistrationComponent } from './course-registration.component';
import { LoginComponent } from '../login/login.component';
import { StudentsComponent } from '../students/students.component';
import { CoursesComponent } from '../courses/courses.component';
import { StudentCoursesComponent } from '../student-courses/student-courses.component';

describe('CourseRegistrationComponent', () => {
  let component: CourseRegistrationComponent;
  let fixture: ComponentFixture<CourseRegistrationComponent>;

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
        MatSnackBarModule
      ],
      declarations: [
        CourseRegistrationComponent,
        LoginComponent,
        StudentsComponent,
        CoursesComponent,
        StudentCoursesComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
