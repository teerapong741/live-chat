import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RoleType } from 'src/app/types/role.type';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  /**
   * Constructor
   */
  constructor(private _router: Router, private _authService: AuthService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Can activate
   *
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }

  /**
   * Can activate child
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._check();
  }

  /**
   * Can load
   *
   * @param route
   * @param segments
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @private
   */
  private _check(): Observable<boolean> {
    // Check the authentication status
    const authenticated = this._authService.isLoggedIn;
    const room = this._authService.authRoom?.room;
    const user = this._authService.auth?.user;
    const role = user?.role;

    console.log({authenticated})
    if (authenticated) {
    //   // Redirect to the root
      let redirectTo = '';
      
      if (room) {
        redirectTo = '/streaming';
      } else if (role === RoleType.ADMIN) {
        redirectTo = '/admin/create-room';
      }
      else if (role === RoleType.STREAMER) {
        redirectTo = '/streamer/home';
      }
      else if (role === RoleType.VIEWER) {
        redirectTo = '/viewer/home';
      }
      else {
        redirectTo = '/sign-in';
      }

      this._router.navigate([redirectTo]);

    //   // Prevent the access
      return of(false);
    }

    // Allow the access
    return of(true);
  }
}
