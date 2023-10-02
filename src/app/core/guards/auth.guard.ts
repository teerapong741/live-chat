import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, combineLatest, of, switchMap } from 'rxjs';

import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RoleType } from 'src/app/types/role.type';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
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
    const redirectUrl =
      state.url === '/sign-in' || state.url === '/register' ? '/' : state.url;
    return this._check(route,state.url, redirectUrl);
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
    const redirectUrl =
      state.url === '/sign-in' || state.url === '/register' ? '/' : state.url;
    return this._check(childRoute,state.url, redirectUrl);
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
    return true;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @param redirectURL
   * @private
   */
  private _check(
    route: ActivatedRouteSnapshot,
    url: string,
    redirectURL: string
  ): Observable<boolean> {
    // Check the authentication status
    return combineLatest([
      of(this._authService.isLoggedIn),
      of(this._authService.auth?.user?.role),
    ]).pipe(
      switchMap(([authenticated, role]) => {
        // If the user is not authenticated...
        if (!authenticated) {
          // Redirect to the sign-in page
          this._router.navigate(['/sign-in'], { queryParams: { redirectURL } });

          // Prevent the access
          return of(false);
        }

        if (authenticated && route.data['isStreaming'] && url !== '/streaming') {
          this._router.navigate(['/streaming']); 
          return of(false);
        }

        if (
          authenticated &&
          !!route.data['role'] &&
          role !== route.data['role']
        ) {
          if (role === RoleType.ADMIN) {
            this._router.navigate(['/admin/create-room']);
          } else if (role === RoleType.STREAMER) {
            this._router.navigate(['/streamer/home']);
          } else if (role === RoleType.VIEWER) {
            this._router.navigate(['/viewer/home']);
          } else {
            this._router.navigate(['/sign-in']);
          }
          return of(false);
        }

        // Allow the access
        return of(true);
      })
    );
  }
}
