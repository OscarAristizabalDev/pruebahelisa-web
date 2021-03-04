import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

declare var jQuery: any

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const routers = this.injector.get(Router);
    
    let request = req;
    request = req.clone({
      setHeaders: {
          'Accept':'application/json',
          'Content-Type': 'application/json',
        }
      });
  
    return next.handle(request)
            .pipe(
                tap(
                    event => {
                        // Si se cuenta con los permisos para acceder a la inf
                        if (event instanceof HttpResponse) {

                        }
                    },
                    error => {
                        if (event instanceof HttpResponse) {
                            
                        } else {
                            // En caso de presentarse un error de consulta de datos
                            if (error.status === 498 || error.status === 499 || error.status === 404) {
                                const router = this.injector.get(Router);
                                // Se cierra el loader
                                jQuery.fancybox.hideLoading();
                                // Se redirecciona al dashboard
                                router.navigate(['/']);
                            }
                        }
                    }
                )
            );
    }
}

