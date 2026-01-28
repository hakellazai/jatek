import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AdminService } from '../services/admin.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private adminService: AdminService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const adminToken = localStorage.getItem('admin-token');

    let authReq = req;

    if (adminToken && req.url.includes('/admin/')) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
    } else if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq);
  }
}
