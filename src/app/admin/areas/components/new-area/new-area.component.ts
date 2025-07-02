import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from 'src/app/components/services/dialog/dialog.service';
import { DialogMessageComponent } from 'src/app/shared/components/dialog-message/dialog-message.component';
import { MyErrorStateMatcher } from 'src/app/shared/helpers/forms/error-state-matcher';
import { Area } from 'src/app/shared/interfaces/departure-ticket.interface';
import { ErrorResponse } from 'src/app/shared/interfaces/error-response.interface';
import { DialogMessageService } from 'src/app/shared/services/dialog-message.service';
import { AreasStore } from '../../services/areas-store';
import { AreasService } from '../../services/areas.service';

@Component({
    selector: 'app-new-area',
    templateUrl: './new-area.component.html',
    styleUrls: ['./new-area.component.css']
})
export class NewAreaComponent implements OnInit {

    matcher = new MyErrorStateMatcher();

    @ViewChild('formDirective') private formDirective!: NgForm;

    newAreaForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private areasService: AreasService,
        private areasStore: AreasStore,
        private dialogService: DialogService,
        private dialogMessageService: DialogMessageService,
        private fb: FormBuilder
    ) { }


    ngOnInit() {
        if (this?.data?.area) {
            this.newAreaForm.get('name')?.setValue(this?.data?.area?.name);
        }
    }

    invalidator(formControlName: string, validator: string) {
        return this.newAreaForm.controls[formControlName].hasError(validator) && this.newAreaForm.controls[formControlName].touched
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

    createItem() {
        if (this.newAreaForm.invalid) {
            this.newAreaForm.markAllAsTouched();
            return;
        }
        if (this?.data?.area) {
            return this.updateItem();
        }
        return this.areasService.createArea(this.formDirective.value).subscribe({
            next: (area: Area) => {
                this.areasStore.emitNewArea({
                    options: ['edit'],
                    ...area,
                });
                this.dialogMessageService.setMessage('Área creada exitosamente');
                this.dialogService.openDialog({ component: DialogMessageComponent, callback: () => this.closeDialog() })
            }, error: (e: ErrorResponse) => {
                this.dialogMessageService.setMessage(e.error.message);
                this.dialogService.openDialog({ component: DialogMessageComponent })
            }
        })
    }

    updateItem() {
        return this.areasService.updateArea(this.data?.area?.id, { ...this.newAreaForm.value })
            .subscribe({
                next: ({ message }: { message: string }) => {
                    this.areasStore.updateArea({
                        id: this.data?.area?.id,
                        name: this.newAreaForm.value.name,
                        status: this.data?.area?.status,
                        options: ['edit'],
                    });
                    this.dialogMessageService.setMessage(message);
                    this.dialogService.openDialog({ component: DialogMessageComponent, callback: () => this.closeDialog() })
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
