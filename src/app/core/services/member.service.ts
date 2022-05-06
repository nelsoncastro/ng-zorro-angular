import { Member } from './../../shared/models/member.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import {environment} from '@env/environment';
import { DefaultFilter } from '@shared/models/filters/default.filter';

@Injectable({providedIn: 'root'})
export class MemberService {

  // Headers
  httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_REST_KEY,
      })
  };

  constructor(private http: HttpClient) { }

  findAll(member: DefaultFilter | null): Observable<any> {
    return this.http
      .post<{result: [], count: number}>(`${environment.serverURL}/list-member`, member, this.httpOptions)
      .pipe(map(data => data.result))
      .pipe(catchError(this.handleError));
  }

  delete(member: Member): Observable<Member> {
    return this.http.post<Member>(`${environment.serverURL}/delete-member`, member, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  save(member: Member): Observable<Member> {
    return this.http.post<Member>(`${environment.serverURL}/create-member`, member, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  update(member: Member): Observable<Member> {
    return this.http.post<Member>(`${environment.serverURL}/change-member`, member, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getById(objectId: string | undefined): Observable<any> {
    return this.http.post<{result: []}>(`${environment.serverURL}/find-member`, { id: objectId }, this.httpOptions)
      .pipe(map(data => data.result))
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
      console.log(`Código do erro: ${error.error.code}, ` + `menssagem: ${error.error.error}`);
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
