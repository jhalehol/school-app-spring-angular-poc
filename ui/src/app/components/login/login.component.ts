import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

const STUDENTS_URL = '/students';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  authError: string | null;

  constructor(public authService: AuthService,
              public router: Router) { }

  ngOnInit() {
    const isLogged = this.authService.isAuthenticatedNonObservable();
    if (isLogged) {
      this.navigateToStudentsView();
    }
  }

  submit() {
    if (this.form.valid) {
      const username = this.form.controls['username'].value;
      const password = this.form.controls['password'].value;
      this.authService.authenticateUser(username, password)
        .subscribe(res => {
          this.authService.storeToken(res);
          this.navigateToStudentsView();
        }, () => {
          this.authError = 'Invalid username/password';
        });
    }
  }

  navigateToStudentsView() {
    this.router.navigate([STUDENTS_URL]);
  }
}
