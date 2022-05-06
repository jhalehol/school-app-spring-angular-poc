import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StudentsService } from './students.service';
import { LoginComponent } from '../components/login/login.component';
import { StudentsComponent } from '../components/students/students.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { StudentCoursesComponent } from '../components/student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../components/course-registration/course-registration.component';
import { AppRoutingModule } from '../app-routing.module';

describe('StudentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
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
      LoginComponent,
      StudentsComponent,
      CoursesComponent,
      StudentCoursesComponent,
      CourseRegistrationComponent
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/' }
    ]
  }));

  it('should be created', () => {
    const service: StudentsService = TestBed.get(StudentsService);
    expect(service).toBeTruthy();
  });
});
