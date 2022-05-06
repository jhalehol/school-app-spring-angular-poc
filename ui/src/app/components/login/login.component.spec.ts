import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatCardModule, MatMenuModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { Credentials } from '../../entities/credentials';
import { AppRoutingModule } from '../../app-routing.module';
import { StudentsComponent } from '../students/students.component';
import { CoursesComponent } from '../courses/courses.component';
import { StudentCoursesComponent } from '../student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../course-registration/course-registration.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const USERNAME = 'username';
  const PASSWORD = 'password';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatCheckboxModule,
        MatTableModule,
        MatMenuModule,
        MatPaginatorModule
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
    })
    .compileComponents();
  }));

  const authService: any = {
    authenticateUser: jasmine.createSpy('authenticateUser')
      .and.returnValue(of(new Credentials())),
    storeToken: jasmine.createSpy('storeToken').and.stub(),
    isAuthenticatedNonObservable: jasmine.createSpy('isAuthenticatedNonObservable').and.stub()
  };

  const router: any = {
    navigate: jasmine.createSpy('navigate').and.stub()
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.authService = authService;
    component.router = router;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on submit should authenticate user', () => {
    // Arrange
    const controls = {
      username: {
        value: USERNAME
      },
      password: {
        value: PASSWORD
      }
    };
    const form: any = {};
    form.controls = controls;
    form.valid = true;
    component.form = form;

    // Act
    component.submit();

    // Assert
    expect(authService.authenticateUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
    expect(authService.storeToken).toHaveBeenCalled();
  });
});
