import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { NavBarComponent } from './nav-bar.component';
import { Credentials } from '../../entities/credentials';
import { MatToolbarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';
import { LoginComponent } from '../login/login.component';
import { StudentsComponent } from '../students/students.component';

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
        AppRoutingModule
      ],
      declarations: [
        NavBarComponent,
        LoginComponent,
        StudentsComponent
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
