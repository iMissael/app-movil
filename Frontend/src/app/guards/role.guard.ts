import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const requiredRole = route.data['role'];
    
    if (user.rol === requiredRole) {
      return true;
    } else {
      if (user.rol === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (user.rol === 'student') {
        this.router.navigate(['/student/materias']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}