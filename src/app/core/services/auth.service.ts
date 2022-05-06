import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

export interface Session {
  name: string;
  sessionToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Headers
  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_REST_KEY,
        'X-Parse-Revocable-Session': '1'
      })
  };

  constructor(private http: HttpClient) { }

  getAuthorizationToken(): string | null {
    return window.sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return window.sessionStorage.getItem('token') != null;
  }

  async login(user: any): Promise<boolean> {
    const result = await this.http
      .post<any>(`${environment.serverURL}/login`, user, this.httpOptions)
      .pipe(map(data => data.result))
      .pipe(retry(1), catchError(this.handleError))
      .toPromise();

    if (result && result.sessionToken) {
      window.sessionStorage.setItem('token', result.sessionToken);
      return true;
    }
    return false;
  }

  logout(): void {
    window.sessionStorage.removeItem('token');
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      const message = `${error}`;
      if (message.split(',')[0].includes('404')) {
        errorMessage = `Usuário e/ou senha inválidos!!!`;
      }
    }
    console.error(error);
    return throwError(errorMessage);
  }

}
