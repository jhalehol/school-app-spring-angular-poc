import { Injectable } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

const AUTHORIZATION_KEY = 'Authorization';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {

  apiUrl: String;
  constructor(private authService: AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    //const token = this.authService.getCurrentCredentials().token;
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNZXRhZGF0YSIsImlhdCI6MTY1MTUwMzIwMSwianRpIjoiQTJfTGJ6N0dIZE56dXNCQ21MUThmZyIsIm5iZiI6MTY1MTUwMzA4MSwic3ViIjoiZmluYW5jaWFsLXRva2VuIiwidXNlci1pZCI6MSwidHlwIjoiSldUIiwiZXhwIjoxNjUxNTg5NjAxLCJpYXRUVEwiOjE2NTE1ODk2MDF9.Ox3BSTjRpnwwDBbJm5AUrsl-KJxj0rY1_BqMB1oXO_kYblG4R1eA6ljZ47RiwmjgEJPuO_nkWVFTUVw1FnarhDWFpcAk8vXzBkuiPxGCBF7dsXzI642bETbbEnef7PGbZ6Us2Q7nOOaGN_VCWtQNVf4lJ_8QbGlX0uzrteTfqSYwklKemCujtMd9xFOAhs2-oO-5JpOPJ7x7yT8SLup3XRebzO3fEEMtnkgvUvSMxGFECODM9hm2EIcN38GZ-BiqgYrs9TCmUox_qDxtz_HFl4jo1xi7ZI5iM-yQCfuc5PjRvO_TxsXD6cAR82BXT2kuaAQFHHp6n9AwmEiz2JC03PHBDl_Eg8S9O4EMuXdUccdekoaerPBQ3pRBNZL4UmyOdYa6vz7r8OwQYtouPYzsSYo0lky8J2-3B11WiAl8wB1eflxKUlzBRq5zMNGqydh1sX5EpIos1wFcYsHGJcS3cgZ_pCmmjRO_bAdRoD2m1hAs-1tTMZq8pR-XVi6JyHDiX2K3hfOfoH0K2NFvBXHKdCvoxgTvg9rhf0UwFuE9dQcunDx6j_IN4PF8YEBEMM7CKJ7ZYRmhXahhpkdC3KMyMVz4ERWEfXDVCAsqCpAC0hJHjH4wnu4pCjBZE3qQDTrBz-KODINDmARyY-0XGjwHYa3UGmhbxcify4ceVl9V4wQ';
    if (token != null) {
      authReq = req.clone({
        url: req.url,
        headers: req.headers.set(AUTHORIZATION_KEY, 'Bearer ' + token)
      });
    } else {
      authReq = req.clone({
        url: req.url,
      });
    }

    return next.handle(authReq);
  }
}
