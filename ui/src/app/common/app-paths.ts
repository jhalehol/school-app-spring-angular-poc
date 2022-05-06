const API_BASE_URL = '/api';

export class AppPaths {

  public static API = {
    AUTH_TOKEN_URL: '/authentication/token',
    STUDENTS_URL: API_BASE_URL + '/students',
    COURSES_URL: API_BASE_URL + '/courses',
  };

  public static UI = {
    LOGIN_PAGE: '/login',
    STUDENTS: '/students',
    COURSES: '/courses',
    STUDENT_COURSES: '/student_courses',
    COURSE_STUDENTS: '/course_students',
    SUBSCRIBE_COURSES: 'subscribe'
  };
}
