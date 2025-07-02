import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MyErrorStateMatcher } from '../../../../shared/helpers/forms/error-state-matcher';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PetitionersService } from '../../services/petitioners.service';
import { PetitionersStore } from '../../services/petitioners-store';
import { DialogService } from '../../../../components/services/dialog/dialog.service';
import { DialogMessageService } from '../../../../shared/services/dialog-message.service';
import { DialogMessageComponent } from '../../../../shared/components/dialog-message/dialog-message.component';
import { ErrorResponse } from '../../../../shared/interfaces/error-response.interface';
import { Petitioner } from '../../../../shared/interfaces/petitioner.interface';
import { Area } from '../../../../shared/interfaces/article-exit-details.interface';
import { AreasService } from '../../../areas/services/areas.service';

@Component({
    selector: 'app-new-petitioner',
    templateUrl: './new-petitioner.component.html',
    styleUrls: ['./new-petitioner.component.css']
})
export class NewPetitionerComponent implements OnInit {
    matcher = new MyErrorStateMatcher();

    areas: Area[] = [];

    @ViewChild('formDirective') private formDirective!: NgForm;

    newPetitionerForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
        area: [, [Validators.required, Validators.min(0)]],
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private petitionersService: PetitionersService,
        private petitionersStore: PetitionersStore,
        private dialogService: DialogService,
        private dialogMessageService: DialogMessageService,
        private areasService: AreasService,
        private fb: FormBuilder
    ) { }


    ngOnInit() {
        if (this?.data?.petitioner) {
            this.newPetitionerForm.get('name')?.setValue(this?.data?.petitioner?.name);
            this.newPetitionerForm.get('area')?.setValue(this?.data?.petitioner?.area?.id);
        }

        this.areasService.getAreas().subscribe((areas: Area[]) => {
            this.areas = areas;
        });
    }

    invalidator(formControlName: string, validator: string) {
        return this.newPetitionerForm.controls[formControlName].hasError(validator) && this.newPetitionerForm.controls[formControlName].touched
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
        if (this.newPetitionerForm.invalid) {
            this.newPetitionerForm.markAllAsTouched();
            return;
        }
        if (this?.data?.petitioner) {
            return this.updateItem();
        }
        return this.petitionersService.createPetitioner(this.newPetitionerForm.value).subscribe({
            next: (petitioner: Petitioner) => {
                this.petitionersStore.emitNewPetitioner({
                    area: petitioner.area?.name,
                    id: petitioner.id,
                    name: petitioner.name,
                    status: petitioner.status,
                    options: ['edit'],
                });
                this.dialogMessageService.setMessage('Solicitante creado exitosamente');
                this.dialogService.openDialog({ component: DialogMessageComponent, callback: () => this.closeDialog() })
            }, error: (e: ErrorResponse) => {
                this.dialogMessageService.setMessage(e.error.message);
                this.dialogService.openDialog({ component: DialogMessageComponent })
            }
        })
    }

    updateItem() {
        return this.petitionersService.updatePetitioner(this.data?.petitioner?.id, { ...this.newPetitionerForm.value })
            .subscribe({
                next: ({ message }: { message: string }) => {
                    this.petitionersStore.updatePetitioner({
                        id: this.data?.petitioner?.id,
                        name: this.newPetitionerForm.value.name,
                        status: this.data?.petitioner?.status,
                        area: this.areas.find((area) => area.id === this.newPetitionerForm.value.area)?.name,
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
