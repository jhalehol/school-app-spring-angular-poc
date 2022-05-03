import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentsComponent } from './components/students/students.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import {ConfirmActionComponent} from './components/confirm-action/confirm-action.component';
import {CoursesComponent} from './components/courses/courses.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'courses', component: CoursesComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
