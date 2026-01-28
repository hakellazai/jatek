import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h1>Grid Conquest - Login</h1>
      <form (ngSubmit)="onLogin()">
        <input 
          type="text" 
          placeholder="Username" 
          [(ngModel)]="username" 
          name="username"
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          [(ngModel)]="password" 
          name="password"
          required
        />
        <button type="submit">Login</button>
        <p>Nincs még fiókod? <a routerLink="/register">Regisztrálj</a></p>
      </form>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    form {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      width: 300px;
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
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .error {
      color: red;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        this.authService.setAuthData(response.token, response.user);
        this.router.navigate(['/lobby']);
      },
      (error: any) => {
        this.error = error.error.error || 'Login failed';
      }
    );
  }
}
