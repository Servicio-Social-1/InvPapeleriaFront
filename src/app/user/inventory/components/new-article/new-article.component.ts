import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogMessageComponent } from 'src/app/shared/components/dialog-message/dialog-message.component';
import { MyErrorStateMatcher } from 'src/app/shared/helpers/forms/error-state-matcher';
import { Article } from 'src/app/shared/interfaces/article.interface';
import { ErrorResponse } from 'src/app/shared/interfaces/error-response.interface';
import { DialogMessageService } from 'src/app/shared/services/dialog-message.service';
import { DialogService } from 'src/app/components/services/dialog/dialog.service';
import { InventoryService } from '../../services/inventory/inventory.service';
import { InventoryStore } from '../../services/store/inventory-store';

@Component({
    selector: 'app-new-article',
    templateUrl: './new-article.component.html',
    styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit {

    matcher = new MyErrorStateMatcher();

    @ViewChild('formDirective') private formDirective!: NgForm;

    newArticleForm: FormGroup = this.fb.group({
        description: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        stock: [, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
        size: [, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private inventoryService: InventoryService,
        private inventoryStore: InventoryStore,
        private dialogService: DialogService,
        private dialogMessageService: DialogMessageService,
        private fb: FormBuilder
    ) { }


    ngOnInit() {
        if (this.data.selectedArticle) {
            this.newArticleForm.setValue(this.data.selectedArticle);
        }
        if (this?.data?.article) {
            this.newArticleForm.get('description')?.setValue(this?.data?.article?.description);
            this.newArticleForm.get('stock')?.setValue(this?.data?.article?.stock);
            this.newArticleForm.get('size')?.setValue(this?.data?.article?.size);
        }
    }

    invalidator(formControlName: string, validator: string) {
        return this.newArticleForm.controls[formControlName].hasError(validator) && this.newArticleForm.controls[formControlName].touched
    }

    requiredInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'required')
    }

    minLengthInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'minlength')
    }

    maxLengthInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'maxLength')
    }

    minCuantityInputInvalidator(formControlName: string) {
        return this.invalidator(formControlName, 'min')
    }

    createItem() {
        if (this.newArticleForm.invalid) {
            this.newArticleForm.markAllAsTouched();
            return;
        }
        if (this?.data?.article) {
            return this.updateItem();
        }

        return this.inventoryService.createArticle(this.newArticleForm.value).subscribe({
          next:(article: Article) => {
            this.inventoryStore.emitNewArticle(article);
            this.newArticleForm.reset();
            this.dialogMessageService.setMessage('Artículo creado exitosamente');
            this.dialogService.openDialog({ component: DialogMessageComponent });
            this.closeDialog();
          },
          error: (e: any) => {
            this.dialogMessageService.setMessage(e.error.text);
            this.dialogService.openDialog({ component: DialogMessageComponent })
        }
        })
    }

    updateItem() {
        const { id, status, ...article } = this.data.article
        return this.inventoryService.update(this.data.article.id, { ...this.newArticleForm.value })
            .subscribe({
                next: (message: string) => {
                    this.inventoryStore.updateArticle({
                        id,
                        status,
                        options: ['edit'],
                        ...this.newArticleForm.value
                    });
                    this.closeDialog();
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
