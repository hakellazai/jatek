import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get auth data', () => {
    const token = 'test-token';
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'player' as const,
      is_banned: false,
      created_at: '2025-01-28',
    };

    service.setAuthData(token, user);

    expect(service.getToken()).toBe(token);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear auth data on logout', () => {
    service.setAuthData('test-token', {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'player',
      is_banned: false,
      created_at: '2025-01-28',
    });

    service.clearAuthData();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
