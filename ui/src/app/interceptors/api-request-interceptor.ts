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
    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNZXRhZGF0YSIsImlhdCI6MTY1MTU4OTY3NiwianRpIjoibjFKb3ZWYU1Ba2J5bUx5STQzQ2JhUSIsIm5iZiI6MTY1MTU4OTU1Niwic3ViIjoiZmluYW5jaWFsLXRva2VuIiwidXNlci1pZCI6MSwidHlwIjoiSldUIiwiZXhwIjoxNjUxNjc2MDc2LCJpYXRUVEwiOjE2NTE2NzYwNzZ9.XSyBKP022nP8we09--8Of2_XSUWNAqQ0hTdqPLM7vPu_jjJni8ExoBSQh_pp2rLbgux946KFOyxJmaAaFuijqzpF7mlX16UCkp_uVA0uLdmD9aQ0EfgD48Y48ccLOP9ovtRVILo0zYXrYeUjPuLDQpCwzVLt_4a46LCIo-MzZQH1aoqiIWCRg2Gfd5xLJ1dKsbyGV22xkJ7FrTDnbALzD7QMPrqOkVjnfRk1npFQyRmaH7ajDXNqawJu6YTZlKixPzXsYeLGnWQAeEPx0AbFAfdLzVSFxV8VBUn9bxxFfJxMXonaCvxlFYdo9qPbg-SnIHsrKb1mU2Y5WbjptncwNGS_2JLVtlXogvcSz9pBTZRAOIl-EZipw7Ppg6Uyn-NaPuvHgx6fHJrKf4R6rBQbgCB0gIcFTteT_V2JhyRcM2zvxbEJICsYQCUzzNhkUB7TtFHw2IjaHZRcuJHTWqY6MTjBMF8IaZRbgwkq6wyFRs2QIkyGg9JkvLp-BbEiDcd6Vzm1df_W7S1DNJJnI-I34F9mpEuUegFPbJVaC9BjNi6Abtv3iUZ7z0HuV29WV0c8nTvxYECzyyi9VQwmSxCtSjEgcmnnIhUYVQQGR8-tAxeiRoSpyEc6cVpwq-V0WIq5TeW52RDX42_IXwVfnu1aOZC-bVLqDs07OfmH_4siRSM';
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
