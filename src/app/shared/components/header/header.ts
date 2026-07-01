import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);

  get autenticado(): boolean {
    return this.auth.isAutenticado();
  }

  get userName(): string {
    return this.auth.getUserName();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
