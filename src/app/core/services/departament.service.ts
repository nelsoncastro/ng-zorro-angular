import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import {environment} from '@env/environment';
import { Departament } from '@shared/models/departament.model';
import { DefaultFilter } from '@shared/models/filters/default.filter';

@Injectable({providedIn: 'root'})
export class DepartamentService {

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

  findAll(body: DefaultFilter | null): Observable<any> {
    return this.http
      .post<{result: [], count: number}>(`${environment.serverURL}/list-departament`, body, this.httpOptions)
      .pipe(map(data => data.result));
  }

  delete(body: Departament): Observable<Departament> {
    return this.http.post<Departament>(`${environment.serverURL}/delete-departament`, body, this.httpOptions)
      .pipe(retry(1));
  }

  save(departament: Departament): Observable<Departament> {
    return this.http.post<Departament>(`${environment.serverURL}/create-departament`, departament, this.httpOptions)
      .pipe(retry(2));
  }

  update(departament: Departament): Observable<Departament> {
    return this.http.post<Departament>(`${environment.serverURL}/change-departament`, departament, this.httpOptions)
      .pipe(retry(2));
  }

  getById(objectId: string | undefined): Observable<any> {
    return this.http.post<{result: []}>(`${environment.serverURL}/find-departament`, { id: objectId }, this.httpOptions)
      .pipe(map(data => data.result))
      .pipe(retry(1));
  }
}
