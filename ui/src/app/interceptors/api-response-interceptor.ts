import {ApiResponse} from '../entities/api-response';
import {AuthService} from '../services/auth.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiResponseInterceptor {

  constructor(private authService: AuthService) {
  }

  public processApiResponse(data: any): ApiResponse {
    const response: ApiResponse = new ApiResponse();
    response.data = data;
    response.hasError = false;
    return response;
  }

  public processApiError(error: any): ApiResponse {
    const response = new ApiResponse();
    response.hasError = false;
    if (error && error.status) {
      this.authService.handleUnauthorized(error);
      response.hasError = true;
      response.errorMessage = 'Something failed during API call';
      if (error) {
        response.errorCode = error.status;
        response.errorMessage = error.statusText;
        const errorInfo = error.error;
        if (errorInfo && typeof errorInfo !== 'object') {
          response.errorMessage = error.error;
        }
      }
    }

    return response;
  }
}
