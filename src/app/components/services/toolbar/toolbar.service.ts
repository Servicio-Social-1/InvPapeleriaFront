import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
    providedIn: 'root'
})
export class ToolbarService {

    drawer!: MatDrawer;

    constructor() { }

    setDrawer(drawer: MatDrawer) {
        this.drawer = drawer;
    }

    toggleDrawer() {
        // this.drawer.toggle()
        // TODO: DRAWER SIEMPRE ABIERTO
        this.drawer.open()
    }

}
