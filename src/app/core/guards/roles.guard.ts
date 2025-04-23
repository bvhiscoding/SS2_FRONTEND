import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // DEVELOPMENT MODE: Always return true to bypass role checks
    return true;
    
    /* Original code (commented out)
    const userRole = JSON.parse(localStorage.getItem('id_token_claims_obj') || '{}')?.role;
    
    if (userRole && userRole[0] === 'Administrator') {
      return true;
    }

    this.router.navigate(['/not-authorized']);
    return false;
    */
  }
}