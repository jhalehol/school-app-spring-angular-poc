import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { MatMenuModule, MatPaginatorModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';

import { NavBarComponent } from './nav-bar.component';
import { Credentials } from '../../entities/credentials';
import { LoginComponent } from '../login/login.component';
import { StudentsComponent } from '../students/students.component';
import { CoursesComponent } from '../courses/courses.component';
import { StudentCoursesComponent } from '../student-courses/student-courses.component';
import { CourseRegistrationComponent } from '../course-registration/course-registration.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  const credentials = new Credentials().username = 'Peter';
  const authService: any = {
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(of(true)),
    getCurrentCredentials: jasmine.createSpy('getCurrentCredentials').and.returnValue(credentials),
    cleanTokenStored: jasmine.createSpy('cleanTokenStored').and.stub()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        HttpClientModule,
        AppRoutingModule,
        MatCheckboxModule,
        MatTableModule,
        MatMenuModule,
        MatPaginatorModule
      ],
      declarations: [
        NavBarComponent,
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
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    component.authService = authService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on init should validate if it is authenticated', () => {
    // Act
    component.ngOnInit();

    // Arrange
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.getCurrentCredentials).toHaveBeenCalled();
  });

  it('on logout should clean stored token', () => {
    // Act
    component.logout();

    // Assert
    expect(authService.cleanTokenStored).toHaveBeenCalled();
  });
});
