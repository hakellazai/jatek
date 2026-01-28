import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h1>Admin Panel - Login</h1>
      <form (ngSubmit)="onLogin()">
        <input 
          type="text" 
          [(ngModel)]="username" 
          name="username"
          placeholder="Admin Username"
          required
        />
        <input 
          type="password" 
          [(ngModel)]="password" 
          name="password"
          placeholder="Admin Password"
          required
        />
        <button type="submit">Belépés</button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    }
    form {
      background: white;
      padding: 40px;
      border-radius: 10px;
      width: 300px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    button {
      width: 100%;
      padding: 10px;
      margin: 20px 0;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  `]
})
export class AdminLoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private adminService: AdminService, private router: Router) {}

  onLogin(): void {
    this.adminService.adminLogin(this.username, this.password).subscribe(
      (response) => {
        this.adminService.setAdminToken(response.token);
        this.router.navigate(['/admin/panel']);
      },
      (error) => {
        this.error = error.error.error || 'Admin login failed';
      }
    );
  }
}
