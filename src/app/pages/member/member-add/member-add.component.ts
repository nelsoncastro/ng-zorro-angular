import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Member } from '@shared/models/member.model';
import { MemberService } from '@core/services/member.service';
import { Address } from '@shared/models/address.model';
import { ViaCepService } from '@core/services/viacep.service';
import { Cep } from '@shared/models/cep.models';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css']
})
export class MemberAddComponent implements OnInit {
  id: string | undefined;
  member!: Member;
  searchAddress!: Address;
  buscarcep: Cep  | null = null;

  validateForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private activateRoute: ActivatedRoute,
              private notification: NzNotificationService,
              private service: MemberService,
              private viaCepService: ViaCepService) {

    this.validateForm = this.fb.group({
      objectId: [''],
      name: ['', [Validators.required]],
      address: [''],
      city: [''],
      cep: [''],
      phone: [''],
      mobile: [''],
      email: [''],
      father: [''],
      mother: [''],
      partner: [''],
      image: [''],
      bloodType: [''],
      weddingDate: [],
      baptized: [false, [Validators.required]],
      married: [false, [Validators.required]],
      active: [false, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.loadData(this.id);
    this.getCep();

  }

  getCep(): void {
    this.viaCepService.getAddressByZipCode('71936250')
    .subscribe((fCep) => {
      this.buscarcep =  fCep;
      console.log(this.buscarcep);
    });
  }

  loadData(id: string | undefined): void {
    if (id) {
      this.service.getById(id).subscribe((member: Member) => {
        this.member = member;
        this.validateForm.patchValue(member);
      });
    }
  }

  onChangeEvent(zipcode: any): void {
    zipcode = zipcode.replace('-', '');
    if (zipcode &&  zipcode.length === 8) {
      // this.viaCepService.getAddressByZipCode(zipcode)
      //   .subscribe(
      //     address => {
      //       if (address.erro === true) {
      //         this.showWarningMsg('CEP não encontrado!');
      //       } else {
      //         this.searchAddress = address;
      //       }
      //     }
      //   );
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const member = (this.validateForm.value as Member);
      if (this.id !== undefined) {
        member.objectId = this.id;
        this.service.update(member).subscribe(() => {
          this.showSuccessMsg('Registro atualizado com sucesso!');
          this.router.navigate(['/member']);
        });
      } else {
        this.service.save(member).subscribe(() => {
          this.showSuccessMsg('Registro criado com sucesso!');
          this.router.navigate(['/member']);
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
    this.router.navigate(['/member']);
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
