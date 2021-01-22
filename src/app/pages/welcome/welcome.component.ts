import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzTableLayout, NzTablePaginationPosition, NzTableSize } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number,
  quantity: number,
  country: string,
  active: boolean,
  rate: number,
}

interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: string;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  formatterReal = (value: number) => `R$ ${value}`;
  parserReal = (value: string) => value.replace('R$ ', '');

  url = "http://localhost:3000/products";

  product = {} as Product;

  products: Product[] = [];

  validateForm!: FormGroup;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  constructor(private fb: FormBuilder, private router: Router,
    private httpClient: HttpClient,
    private notification: NzNotificationService) {
    this.validateForm = this.fb.group({});
  }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [''],
    });

    this.loadData();
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url)
      .pipe(retry(2), catchError(this.handleError))
  }

  deleteProduct(product: Product) {
    return this.httpClient.delete<Product>(this.url + '/' + product.id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError))
  }

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

  loadData() {
    this.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.loadData();
  }

  submitForm(value: { name: string; }): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.products = this.products.filter(d => d.name.toLowerCase().includes(value.name.toLowerCase()));
  }

  deleteRow(product: Product): void {
    this.deleteProduct(product).subscribe(() => {
      this.showSuccessMsg('Registro excluído com sucesso!')
      this.loadData();
    });
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
