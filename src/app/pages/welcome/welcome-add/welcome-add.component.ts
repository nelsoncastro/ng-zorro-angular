import { Product } from './../welcome.component';
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';


interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-welcome-add',
  templateUrl: './welcome-add.component.html',
  styleUrls: ['./welcome-add.component.css']
})
export class WelcomeAddComponent implements OnInit {

  url = "https://my-json-server.typicode.com/nelsoncastro/ng-zorro-angular/products";

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  validateForm: FormGroup;

  formatterReal = (value: number) => `R$ ${value}`;
  parserReal = (value: string) => value.replace('R$ ', '');

  countrys: Country[] = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Chile', code: 'CL' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Peru', code: 'PE' },
    { name: 'Venezuela', code: 'VE' },
  ];

  id: number | undefined;
  product!: Product;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private notification: NzNotificationService) {

    this.validateForm = this.fb.group({
      name: ['', [Validators.required], [this.nameAsyncValidator]],
      description: ['', [Validators.required]],
      category: ['A', [Validators.required]],
      country: ['BR', [Validators.required]],
      quantity: [0, [Validators.required]],
      price: [0.0, [Validators.required]],
      active: [false, [Validators.required]],
      rate: [0, [Validators.required]],
    });

  }
  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.loadProduct(this.id);
  }

  loadProduct(id: number | undefined): void {
    if (id) {
      this.getProductById(id).subscribe((product: Product) => {
        this.product = product;
        this.validateForm.patchValue(product);
      });
    }
  }

  submitForm(value: { id: number; name: string; description: string; price: number; quantity: number }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.id !== undefined) {
      value.id = this.id;
      this.updateProduct((value as Product)).subscribe(() => {
        this.showSuccessMsg('Registro atualizado com sucesso!!!');
        this.router.navigate([""]);
      });
    } else {
      this.saveProduct((value as Product)).subscribe(() => {
        this.showSuccessMsg('Registro criado com sucesso!!!');
        this.router.navigate([""]);
      });
    }
  }

  saveProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.url, JSON.stringify(product), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError))
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(this.url + '/' + product.id,
      JSON.stringify(product), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));

  }

  getProductById(id: number | undefined): Observable<Product> {
    return this.httpClient.get<Product>(this.url + '/' + id)
      .pipe(retry(1), catchError(this.handleError))
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.router.navigate([""]);
  }

  nameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.getProductByName(control.value).subscribe((products: Product[]) => {
          if ((this.product && this.product.name !== control.value && products.length > 0)
            || (!this.id && products.length > 0)) {
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        });
      }, 1000);

    });

  getProductByName(name: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url + '/?name=' + name)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }

  showSuccessMsg(message: string): void {
    this.createNotification('success', 'Sucesso', message);
  }

  showErrorMsg(message: string): void {
    this.createNotification('error', 'Erro', message);
  }

  showWarningMsg(message: string): void {
    this.createNotification('warning', 'Atenção', message);
  }

  showInfoMsg(message: string): void {
    this.createNotification('info', 'Informação', message);
  }

}
