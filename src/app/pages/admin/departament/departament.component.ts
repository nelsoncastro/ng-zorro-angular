import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Departament } from '@shared/models/departament.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DepartamentService } from '@core/services/departament.service';

@Component({
  selector: 'app-departament',
  templateUrl: './departament.component.html',
  styleUrls: ['./departament.component.css']
})
export class DepartamentComponent implements OnInit {

  departament = {} as Departament;

  departaments: Departament[] = [];
  loading = true;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  searchValue = '';
  visible = false;

  validateForm!: FormGroup;

  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  constructor(private fb: FormBuilder,
              private notification: NzNotificationService,
              private service: DepartamentService) {
              this.validateForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [''],
    });
  }

  loadData(page: number,
           pageSize: number,
           sortField: string | null,
           sortOrder: string | null,
           filters: Array<{ key: string; value: string }>): void {
    this.loading = true;
    this.service.findAll({page, pageSize, sortField, sortOrder, filters})
    .subscribe(data => {
      this.loading = false;
      this.totalItems = data.count;
      this.departaments = data.results;
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.loadData(this.pageIndex, this.pageSize, null, null, []);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadData((pageIndex > 0 ? pageIndex - 1 : 0), pageSize, sortField, sortOrder, filter);
  }

  submitForm(value: { name: string; }): void {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  deleteRow(member: Departament): void {
    this.service.delete(member).subscribe(() => {
      this.showSuccessMsg('Registro excluído com sucesso!');
      this.loadData(this.pageIndex, this.pageSize, null, null, []);
    });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    const filters: { key: string; value: string }[] = [];
    filters.push({ key: 'name', value: this.searchValue });
    this.loadData(this.pageIndex, this.pageSize, null, null, filters);
  }

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message, { nzKey: type, nzDuration: 3000 });
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
