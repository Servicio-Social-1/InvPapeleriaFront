import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(
        public dialog: MatDialog
    ) { }

    openDialog<T>({ component, callback, data, sizes }: {
        component: any, callback?: () => any, data?: T, sizes?: {
            minWidth: string
        }
    }) {
        const dialogRef = this.dialog.open(component, {
            maxHeight: '600px',
            minWidth: sizes?.minWidth ? sizes?.minWidth : undefined,
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            if (callback) {
                callback();
            }
        });
    }

    closeDialog() {
        this.dialog.closeAll();
    }

}
