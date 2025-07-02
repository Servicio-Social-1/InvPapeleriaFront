import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DialogService } from '../../../../components/services/dialog/dialog.service';

@Component({
    selector: 'app-new-entry-ticket',
    templateUrl: './new-entry-ticket.component.html',
    styleUrls: ['./new-entry-ticket.component.css']
})
export class NewEntryTicketComponent implements OnInit {

    @ViewChild('formDirective') private formDirective!: NgForm;

    newItemForm: FormGroup = this.fb.group({
        description: [, [Validators.required, Validators.minLength(3)]],
        stock: [, [Validators.required, Validators.min(0)]],
        measures: [, [Validators.required]]
    });

    constructor(
        private dialogService: DialogService,
        private fb: FormBuilder
    ) { }


    ngOnInit() {
        this.newItemForm.setValue({
            description: 'RTX 4080ti',
            stock: 1600,
            measures: 10
        })
    }

    invalidator(formControlName: string, validator: string) {
        return this.newItemForm.controls[formControlName].hasError(validator) && this.newItemForm.controls[formControlName].touched
    }

    requiredInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'required')
    }

    minLengthInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'minlength')
    }

    minCuantityInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'min')
    }

    createItem() {

        if (this.newItemForm.invalid) {
            this.newItemForm.markAllAsTouched();
            return;
        }
        this.formDirective.resetForm();
    }


    closeDialog() {
        this.dialogService.closeDialog();
    }


}
