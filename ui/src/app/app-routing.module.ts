import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentsComponent } from './components/students/students.component';
import { CoursesComponent } from './components/courses/courses.component';
import { StudentCoursesComponent } from './components/student-courses/student-courses.component';
import { CourseRegistrationComponent } from './components/course-registration/course-registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: StudentsComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'student_courses', component: StudentCoursesComponent },
  { path: 'course_students', component: StudentCoursesComponent },
  { path: 'subscribe', component: CourseRegistrationComponent }
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
