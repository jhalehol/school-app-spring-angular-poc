import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Credentials } from '../entities/credentials';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const USERNAME = 'peter';
  const TOKEN = 'tokenize';

  function mockRouter(): any {
    return {
      navigate: jasmine.createSpy('navigate').and.stub()
    };
  }

  it('when clean session data then remove credentials', () => {
    // Arrange
    const credentials: Credentials = new Credentials();
    credentials.token = TOKEN;
    credentials.username = USERNAME;
    const router = mockRouter();

    const httpClientSpy: any = {
      post: jasmine.createSpy('post').and.returnValue(of(credentials))
    };
    const service: AuthService = new AuthService(httpClientSpy, router);

    // Act
    const result: Observable<Credentials> = service.authenticateUser('boss', 'light-year');

    // Assert
    expect(httpClientSpy.post).toHaveBeenCalled();
    result.subscribe(data => {
      expect(data.token).toBe(TOKEN);
      expect(data.username).toBe(USERNAME);
    });
  });


  it('when receives and unauthorized exception then logout', () => {
    // Arrange
    const error = {
      status: 401
    };
    const router = mockRouter();
    const service: AuthService = new AuthService(null, router);

    // Act
    const result: boolean = service.handleUnauthorized(error);

    // Assert
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(true);
  });
});
