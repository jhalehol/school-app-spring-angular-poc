import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatMenuModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CoursesComponent } from './courses.component';
import { LoginComponent } from '../login/login.component';
import { StudentsComponent } from '../students/students.component';
import { StudentCoursesComponent } from '../student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../course-registration/course-registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

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
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [
        CoursesComponent,
        LoginComponent,
        StudentsComponent,
        CoursesComponent,
        StudentCoursesComponent,
        CourseRegistrationComponent
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
