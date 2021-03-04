import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const routers = this.injector.get(Router);
    
    let request = req;
    // Se envia el token por el header
    request = req.clone({
      setHeaders: {
          'Accept':'application/json',
          'Content-Type': 'application/json',
          //'Authorization': 'Bearer f41d16fba69a1326d569a45579b55bf0807b4c098c01a5d32ed650f91bef573a',
        }
      });
  
    return next.handle(request)
            .pipe(
                tap(
                    event => {
                        // Si se cuenta con los permisos para acceder a la inf
                        if (event instanceof HttpResponse) {
                          // console.log('api call success : ', event);
                        }
                    },
                    error => {
                        if (event instanceof HttpResponse) {
                            
                        } else {
                        // En caso de presentarse un error de authorizacione
                            if (error.status === 498 || error.status === 499 || error.status === 401) {
                                const router = this.injector.get(Router);
                                // Se cierra la cesión
                                //jQuery.fancybox.hideLoading();
                                // Se redirecciona al login
                                //router.navigate(['/']);
                            }
                        }
                    }
                )
            );
    }
}

