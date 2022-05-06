import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cep } from '@shared/models/cep.models';

@Injectable({providedIn: 'root'})
export class ViaCepService {

  private readonly  baseUrl: string = 'http://viacep.com.br/ws';

  constructor(private http: HttpClient) { }

  getAddressByZipCode(cep: string): Observable<Cep> {
    return this.http.get<Cep>(`${this.baseUrl}/${cep}/json/`)
  }
}
