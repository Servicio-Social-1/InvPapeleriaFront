import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMessageService } from '../../../../shared/services/dialog-message.service';
import { DialogService } from '../../../../components/services/dialog/dialog.service';
import { UsersService } from '../../services/users.service';
import { UsersStore } from '../../services/users-store';
import { EmailValidatorService } from '../../../../shared/validators/email-validator.service';
import { MyErrorStateMatcher } from '../../../../shared/helpers/forms/error-state-matcher';
import { ErrorResponse } from '../../../../shared/interfaces/error-response.interface';
import { DialogMessageComponent } from '../../../../shared/components/dialog-message/dialog-message.component';
import { User } from '../../../../shared/interfaces/departure-ticket.interface';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

    matcher = new MyErrorStateMatcher();

    private readonly passwordPlaceholder = '********';

    @ViewChild('formDirective') private formDirective!: NgForm;

    newUserForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.pattern(this.emailValidator.emailPattern)], [this.emailValidator]],
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        password: ['', [Validators.minLength(6), Validators.maxLength(20)]],
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private usersService: UsersService,
        private usersStore: UsersStore,
        private emailValidator: EmailValidatorService,
        private dialogService: DialogService,
        private dialogMessageService: DialogMessageService,
        private fb: FormBuilder
    ) { }


    ngOnInit() {
        if (this?.data?.user) {
            this.newUserForm.get('email')?.setValue(this?.data?.user?.email);
            this.newUserForm.get('name')?.setValue(this?.data?.user?.name);
            this.newUserForm.get('password')?.setValue(this.passwordPlaceholder);
        }
    }

    invalidator(formControlName: string, validator: string) {
        return this.newUserForm.controls[formControlName].hasError(validator) && this.newUserForm.controls[formControlName].touched
    }

    requiredInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'required')
    }

    minLengthInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'minlength')
    }

    maxLengthInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'maxlength')
    }

    emailInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'pattern')
    }


    createItem() {
        if (this.newUserForm.invalid) {
            this.newUserForm.markAllAsTouched();
            return;
        }
        if (this?.data?.user) {
            return this.updateItem();
        }
        return this.usersService.createUser(this.formDirective.value).subscribe({
            next: (user: User) => {
                this.usersStore.emitNewUser({
                    role: user.role.name,
                    email: user.email,
                    name: user.name,
                    id: user.id,
                    status: user.status,
                    options: ['edit'],
                });
                this.dialogMessageService.setMessage('Usuario creado exitosamente');
                this.dialogService.openDialog({ component: DialogMessageComponent, callback: () => this.closeDialog() })
            }, error: (e: ErrorResponse) => {
                this.dialogMessageService.setMessage(e.error.message);
                this.dialogService.openDialog({ component: DialogMessageComponent })
            }
        })
    }

    updateItem() {
        const { email, password, name } = this.formDirective.value;
        const updateData = password === this.passwordPlaceholder ? { email, name } : { email, password, name };
        return this.usersService.updateUser(this.data?.user?.id, { ...updateData })
            .subscribe({
                next: ({ message }: { message: string }) => {
                    this.usersStore.updateUser({
                        id: this.data?.user?.id,
                        email: updateData?.email,
                        role: this.data?.user?.role?.name,
                        name,
                        status: this.data?.user?.status,
                        options: ['edit'],
                    });
                    this.dialogMessageService.setMessage(message);
                    this.dialogService.openDialog({
                        component: DialogMessageComponent,
                        callback: () => this.closeDialog()
                    })
                },
                error: (e: ErrorResponse) => {
                    this.dialogMessageService.setMessage(e.error.message);
                    this.dialogService.openDialog({ component: DialogMessageComponent })
                }
            })
    }


    closeDialog() {
        this.dialogService.closeDialog();
    }

}
