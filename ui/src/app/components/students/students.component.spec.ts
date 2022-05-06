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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { StudentsComponent } from './students.component';
import { LoginComponent } from '../login/login.component';
import { CoursesComponent } from '../courses/courses.component';
import { StudentCoursesComponent } from '../student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../course-registration/course-registration.component';

describe('StudentsComponent', () => {
  let component: StudentsComponent;
  let fixture: ComponentFixture<StudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatTableModule,
        MatMenuModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      declarations: [
        StudentsComponent,
        LoginComponent,
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
    fixture = TestBed.createComponent(StudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
