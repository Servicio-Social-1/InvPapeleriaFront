import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { ToolbarService } from '../services/toolbar/toolbar.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('drawer') drawer!: MatDrawer;

    userStatusSubs!: Subscription;
    isAdmin!: boolean;
    isUser!: boolean;

    constructor(
        private toolbarService: ToolbarService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userStatusSubs = this.authService.adminStatus().subscribe((isAdmin: boolean) => {
            this.isAdmin = isAdmin;
        });
        this.authService.userStatus().subscribe((isUser: boolean) => {
            this.isUser = isUser;
        });
    }

    ngAfterViewInit() {
        this.toolbarService.setDrawer(this.drawer);
        // TODO: DRAWER SIEMPRE ABIERTO
        this.toolbarService.toggleDrawer();
    }

    changeRoute(...routes: string[]) {
        // this.toolbarService.toggleDrawer();
        this.router.navigate(['/', ...routes]);
    }

    ngOnDestroy(): void {
        this.userStatusSubs?.unsubscribe();
    }

}
