import { DepartamentService } from '@core/services/departament.service';
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Departament } from '@shared/models/departament.model';


@Component({
  selector: 'app-departament-add',
  templateUrl: './departament-add.component.html',
  styleUrls: ['./departament-add.component.css']
})
export class DepartamentAddComponent implements OnInit {

  id: string | undefined;
  departament!: Departament;

  validateForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private activateRoute: ActivatedRoute,
              private notification: NzNotificationService,
              private service: DepartamentService) {

    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      active: [false, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.loadData(this.id);
  }

  loadData(id: string | undefined): void {
    if (id) {
      this.service.getById(id).subscribe((departament: Departament) => {
        this.departament = departament;
        this.validateForm.patchValue(departament);
      });
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const departament = (this.validateForm.value as Departament);
      if (this.id !== undefined) {
        departament.objectId = this.id;
        this.service.update(departament).subscribe(() => {
          this.showSuccessMsg('Registro atualizado com sucesso!');
          this.router.navigate(['/departament']);
        });
      } else {
        this.service.save(departament).subscribe(() => {
          this.showSuccessMsg('Registro criado com sucesso!');
          this.router.navigate(['/departament']);
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.router.navigate(['/departament']);
  }

  createNotification(type: string, title: string, message: string): void {
    const ref = this.notification.create(type, title, message, { nzKey: type, nzDuration: 3000 });
    console.log(ref);
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
